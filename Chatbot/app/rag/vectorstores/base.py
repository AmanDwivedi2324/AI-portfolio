"""Vector store interface + the small filter language both stores support.

Filters use Pinecone's syntax so the same router output works everywhere:
    {"section": {"$in": ["projects", "experience"]}}
    {"entities": {"$in": ["blogpilot"]}}      # matches list fields too
    {"$or": [ {...}, {...} ]}
"""

from typing import Any, Protocol

import numpy as np

from ..models import Chunk, Match

Filter = dict[str, Any]


class VectorStore(Protocol):
    name: str

    def reset(self) -> None: ...

    def upsert(self, chunks: list[Chunk], vectors: np.ndarray) -> None: ...

    def query(self, vector: list[float], top_k: int, filter: Filter | None = None) -> list[Match]: ...

    def count(self) -> int: ...


def matches_filter(metadata: dict, flt: Filter | None) -> bool:
    """Evaluate a Pinecone-style filter against chunk metadata (used by the local store)."""
    if not flt:
        return True
    for key, condition in flt.items():
        if key == "$or":
            if not any(matches_filter(metadata, sub) for sub in condition):
                return False
            continue
        if key == "$and":
            if not all(matches_filter(metadata, sub) for sub in condition):
                return False
            continue
        value = metadata.get(key)
        values = value if isinstance(value, list) else [value]
        if isinstance(condition, dict):
            if "$in" in condition and not set(values) & set(condition["$in"]):
                return False
            if "$eq" in condition and condition["$eq"] not in values:
                return False
        elif condition not in values:
            return False
    return True
