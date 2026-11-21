"""Tiny in-memory TTL + LRU cache for first-turn answers.

Common recruiter questions (and the suggested-question chips) get answered
instantly after the first time, with no retrieval or LLM call.
"""

import re
import time
from collections import OrderedDict
from typing import Any


def normalize_question(text: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", "", re.sub(r"\s+", " ", text.lower())).strip()


class TTLCache:
    def __init__(self, max_size: int, ttl_seconds: int):
        self.max_size, self.ttl = max_size, ttl_seconds
        self._data: OrderedDict[str, tuple[float, Any]] = OrderedDict()

    def get(self, key: str) -> Any | None:
        item = self._data.get(key)
        if item is None:
            return None
        stored_at, value = item
        if time.monotonic() - stored_at > self.ttl:
            del self._data[key]
            return None
        self._data.move_to_end(key)
        return value

    def set(self, key: str, value: Any) -> None:
        self._data[key] = (time.monotonic(), value)
        self._data.move_to_end(key)
        while len(self._data) > self.max_size:
            self._data.popitem(last=False)

    def clear(self) -> None:
        self._data.clear()
