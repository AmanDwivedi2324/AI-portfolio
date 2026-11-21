"""Fast, rule-based query routing (no LLM call, microseconds).

Decides:
  - small talk (greetings, thanks, "who are you") → answered without RAG
  - which metadata filter to apply, so retrieval looks first in the right
    part of the knowledge base (e.g. a BlogPilot question → BlogPilot chunks)
"""

import re
from dataclasses import dataclass, field

from .catalog import find_entities
from .vectorstores.base import Filter

_SMALL_TALK = {
    "greeting": re.compile(r"^(hi+|hello+|hey+|hiya|yo|namaste|good (morning|afternoon|evening))[\s!.,?]*$", re.I),
    "thanks": re.compile(r"^(thanks?( you)?|thank u|thx|ty|great,? thanks?|awesome|cool|ok(ay)?,? thanks?)[\s!.,]*$", re.I),
    "bye": re.compile(r"^(bye+|goodbye|see you|see ya|cya)[\s!.,]*$", re.I),
    "identity": re.compile(r"^(who|what) are you\??$|^are you (a )?(bot|ai|human|real)\??$|^what can you do\??$", re.I),
}

# Category → trigger words/phrases (lower-case, word-boundary matched).
_CATEGORY_TERMS: dict[str, list[str]] = {
    "projects": ["project", "projects", "built", "build", "portfolio", "app", "application", "github repo"],
    "experience": [
        "experience", "work", "worked", "working", "job", "intern", "internship", "company", "companies",
        "employer", "role", "position", "current", "currently", "trainee",
    ],
    "skills": ["skill", "skills", "tech stack", "stack", "technologies", "technology", "tools", "framework", "frameworks",
               "languages", "language", "proficient", "know"],
    "education": ["education", "college", "university", "degree", "b.tech", "btech", "cgpa", "gpa", "aktu", "study",
                  "studied", "graduate", "graduation", "leadership", "activities", "ieee"],
    "goals": ["goal", "goals", "future", "aspire", "aspiration", "long-term", "long term", "career", "plan", "plans"],
    "hr": ["yourself", "hire", "strength", "strengths", "strongest", "different", "why ai", "weakness"],
    "journey": ["journey", "started", "start", "background", "began", "transition", "path"],
    "learning": ["learn", "learning", "resources", "courses", "course"],
    "interests": ["interest", "interests", "interested", "passion"],
    "profile": ["contact", "email", "linkedin", "github", "leetcode", "reach", "location", "based", "who is aman", "about aman"],
}
_CATEGORY_PATTERNS = {
    cat: re.compile(r"\b(" + "|".join(re.escape(t) for t in terms) + r")\b", re.I) for cat, terms in _CATEGORY_TERMS.items()
}

# Follow-ups like "what tech did it use?" need the previous question for retrieval.
_FOLLOW_UP = re.compile(r"\b(it|its|that|this|those|these|there|they|them|he|his|more|else|also|same)\b", re.I)


@dataclass
class Route:
    small_talk: str | None = None
    categories: list[str] = field(default_factory=list)
    entities: list[str] = field(default_factory=list)
    retrieval_query: str = ""

    @property
    def filter(self) -> Filter | None:
        if self.entities:
            return {"entities": {"$in": self.entities}}
        if self.categories:
            return {"section": {"$in": self.categories}}
        return None


def route(question: str, previous_question: str | None = None) -> Route:
    q = question.strip()
    for kind, pattern in _SMALL_TALK.items():
        if pattern.match(q):
            return Route(small_talk=kind, retrieval_query=q)

    retrieval_query = q
    if previous_question and (len(q.split()) <= 7 or _FOLLOW_UP.search(q)) and not find_entities(q):
        retrieval_query = f"{previous_question} {q}"

    return Route(
        categories=[cat for cat, pattern in _CATEGORY_PATTERNS.items() if pattern.search(retrieval_query)],
        entities=find_entities(retrieval_query),
        retrieval_query=retrieval_query,
    )
