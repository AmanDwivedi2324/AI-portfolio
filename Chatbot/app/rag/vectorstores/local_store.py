"""In-process vector index (NumPy). Exact cosine search; < 1 ms for this KB.

Used for local development, tests, and as a fallback if Pinecone is down.
Persisted as `vectors.npy` + `chunks.json` in LOCAL_INDEX_DIR.
"""

import json
from pathlib import Path

import numpy as np

from ..models import Chunk, Match
from .base import Filter, matches_filter


class LocalVectorStore:
    name = "local"

    def __init__(self, directory: Path):
        self.directory = Path(directory)
        self._chunks: list[Chunk] = []
        self._vectors = np.zeros((0, 0), dtype=np.float32)
        self._load()

    # ── persistence ─────────────────────────────────────────────
    def _load(self) -> None:
        chunks_file = self.directory / "chunks.json"
        vectors_file = self.directory / "vectors.npy"
        if chunks_file.exists() and vectors_file.exists():
            self._chunks = [Chunk(**c) for c in json.loads(chunks_file.read_text(encoding="utf-8"))]
            self._vectors = np.load(vectors_file)

    def _save(self) -> None:
        self.directory.mkdir(parents=True, exist_ok=True)
        payload = [{"id": c.id, **c.metadata()} for c in self._chunks]
        (self.directory / "chunks.json").write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
        np.save(self.directory / "vectors.npy", self._vectors)

    # ── VectorStore API ─────────────────────────────────────────
    def reset(self) -> None:
        self._chunks, self._vectors = [], np.zeros((0, 0), dtype=np.float32)

    def replace(self, chunks: list[Chunk], vectors: np.ndarray, persist: bool = True) -> None:
        """Swap in a complete index (e.g. loaded from Pinecone) in one step."""
        self._chunks, self._vectors = list(chunks), np.asarray(vectors, dtype=np.float32)
        if persist:
            self._save()

    def upsert(self, chunks: list[Chunk], vectors: np.ndarray) -> None:
        by_id = {c.id: (c, v) for c, v in zip(self._chunks, self._vectors)} if len(self._chunks) else {}
        for chunk, vector in zip(chunks, vectors):
            by_id[chunk.id] = (chunk, vector)
        self._chunks = [c for c, _ in by_id.values()]
        self._vectors = np.stack([v for _, v in by_id.values()]).astype(np.float32)
        self._save()

    def query(self, vector: list[float], top_k: int, filter: Filter | None = None) -> list[Match]:
        if not self._chunks:
            return []
        scores = self._vectors @ np.asarray(vector, dtype=np.float32)
        order = np.argsort(-scores)
        results: list[Match] = []
        for i in order:
            chunk = self._chunks[i]
            if matches_filter(chunk.metadata(), filter):
                results.append(Match(chunk=chunk, score=float(scores[i])))
                if len(results) == top_k:
                    break
        return results

    def count(self) -> int:
        return len(self._chunks)

    @property
    def chunks(self) -> list[Chunk]:
        return list(self._chunks)
