"""Chat orchestration: cache → route → retrieve → (gate) → LLM stream.

Emits events consumed by both the streaming and the JSON endpoint:
  {"type": "token", "text": "..."}                         answer text, in order
  {"type": "done", "sources": [...], "refused": bool,
   "cached": bool, "timings": {...}}                        end of answer
  {"type": "error", "message": "..."}                       something failed
"""

import logging
import time
from collections.abc import AsyncIterator

from ..config import Settings
from ..llm.groq_client import LLM
from ..rag.models import Match
from ..rag.prompts import REFUSAL, SMALL_TALK_REPLIES, build_messages
from ..rag.retriever import Retriever
from ..rag.router import route
from .cache import TTLCache, normalize_question

log = logging.getLogger("chat")
MAX_SOURCES = 3


def _sources(matches: list[Match]) -> list[dict]:
    seen, out = set(), []
    for m in matches:
        title = m.chunk.heading.split(" › ")[0].split(" · ")[0]
        if title in seen:
            continue
        seen.add(title)
        out.append({"title": title, "section": m.chunk.section_title})
        if len(out) == MAX_SOURCES:
            break
    return out


class ChatService:
    def __init__(self, retriever: Retriever, llm: LLM | None, settings: Settings):
        self.retriever = retriever
        self.llm = llm
        self.settings = settings
        self.cache = TTLCache(settings.answer_cache_size, settings.answer_cache_ttl_seconds)

    async def stream(self, question: str, history: list[dict]) -> AsyncIterator[dict]:
        started = time.perf_counter()
        ms = lambda: round((time.perf_counter() - started) * 1000)  # noqa: E731
        question = question.strip()
        history = history[-self.settings.max_history_turns * 2 :]
        previous_question = next((h["content"] for h in reversed(history) if h["role"] == "user"), None)

        # 1. Instant answers: cache (first turn only) and small talk.
        cache_key = normalize_question(question) if not history else None
        if cache_key and (hit := self.cache.get(cache_key)):
            yield {"type": "token", "text": hit["answer"]}
            yield {"type": "done", "sources": hit["sources"], "refused": hit["refused"], "cached": True, "timings": {"total_ms": ms()}}
            return

        r = route(question, previous_question)
        if r.small_talk:
            yield {"type": "token", "text": SMALL_TALK_REPLIES[r.small_talk]}
            yield {"type": "done", "sources": [], "refused": False, "cached": False, "timings": {"total_ms": ms()}}
            return

        # 2. Retrieval + relevance gate.
        retrieval = await self.retriever.retrieve(r)
        retrieval_ms = ms()
        if not retrieval.matches:
            log.info("refused by gate score=%.3f q=%r", retrieval.best_score, question[:80])
            yield {"type": "token", "text": REFUSAL}
            result = {"answer": REFUSAL, "sources": [], "refused": True}
            if cache_key:
                self.cache.set(cache_key, result)
            yield {"type": "done", **{k: v for k, v in result.items() if k != "answer"}, "cached": False,
                   "timings": {"retrieval_ms": retrieval_ms, "total_ms": ms()}}
            return

        if self.llm is None:
            yield {"type": "error", "message": "The assistant isn't configured yet (missing GROQ_API_KEY)."}
            return

        # 3. Grounded generation, streamed token by token.
        messages = build_messages(question, history, retrieval.matches)
        parts: list[str] = []
        first_token_ms = None
        async for text in self.llm.stream(messages):
            if first_token_ms is None:
                first_token_ms = ms()
            parts.append(text)
            yield {"type": "token", "text": text}

        answer = "".join(parts).strip()
        refused = answer.startswith(REFUSAL[:60])
        result = {"answer": answer, "sources": [] if refused else _sources(retrieval.matches), "refused": refused}
        if cache_key and answer:
            self.cache.set(cache_key, result)
        timings = {"retrieval_ms": retrieval_ms, "first_token_ms": first_token_ms, "total_ms": ms()}
        log.info("answered score=%.3f filter=%s chunks=%d %s q=%r", retrieval.best_score, retrieval.used_filter,
                 len(retrieval.matches), timings, question[:80])
        yield {"type": "done", "sources": result["sources"], "refused": refused, "cached": False, "timings": timings}

    async def answer(self, question: str, history: list[dict]) -> dict:
        """Non-streaming convenience wrapper."""
        text, final = [], {}
        async for event in self.stream(question, history):
            if event["type"] == "token":
                text.append(event["text"])
            elif event["type"] == "done":
                final = event
            elif event["type"] == "error":
                raise RuntimeError(event["message"])
        return {"answer": "".join(text).strip(), **{k: v for k, v in final.items() if k != "type"}}
