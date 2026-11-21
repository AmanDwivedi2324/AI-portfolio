"""Knowledge-base taxonomy: section categories and named entities.

Used at ingestion time to tag chunks (metadata for filtering) and at query
time by the router to build the same filters from the question.
"""

import re

# Section number → category stored as `section` metadata.
SECTION_CATEGORIES: dict[int, str] = {
    0: "profile",  # cover page
    1: "profile",
    2: "journey",
    3: "education",
    4: "experience",
    5: "projects",
    6: "skills",
    7: "interests",
    8: "goals",
    9: "learning",
    10: "hr",
}

# Sections whose subsections each describe a different company/project:
# their chunks must never mix two subsections.
ISOLATED_SECTIONS = {4, 5}

# Sections that are instructions for the bot or document upkeep, not facts
# about Aman. They shape the system prompt instead of being retrieved.
EXCLUDED_SECTIONS = {11, 12}

# Canonical entity → phrases that identify it (lower-case, matched on word boundaries).
ENTITIES: dict[str, list[str]] = {
    "cupshup": ["cupshup", "cup shup", "gtm automation", "gtm"],
    "raventra": ["raventra", "solar"],
    "difmo": ["difmo"],
    "youtube-assistant": ["youtube assistant", "youtube", "yt assistant"],
    "blogpilot": ["blogpilot", "blog pilot", "blog writing", "blog-writing"],
    "admission-predictor": ["admission predictor", "admission"],
    "speech-emotion": ["speech emotion", "emotion recognition"],
    "age-detection": ["age detection", "age classification"],
    "ieee": ["ieee", "enigma", "seminar", "bootcamp"],
}

_ENTITY_PATTERNS = {
    entity: re.compile(r"\b(" + "|".join(re.escape(p) for p in phrases) + r")\b", re.IGNORECASE)
    for entity, phrases in ENTITIES.items()
}


def find_entities(text: str) -> list[str]:
    """Entities mentioned in `text`, in a stable order."""
    return [entity for entity, pattern in _ENTITY_PATTERNS.items() if pattern.search(text)]
