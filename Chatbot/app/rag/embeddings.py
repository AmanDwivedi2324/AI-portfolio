"""Local embeddings with fastembed (ONNX, CPU).

Running the model in-process means a question costs ~10 ms to embed instead
of an extra network round trip to an embeddings API.
"""

from functools import lru_cache

import numpy as np
from fastembed import TextEmbedding

# BGE v1.5 retrieves best when short queries carry this instruction
# (passages are embedded without it).
BGE_QUERY_INSTRUCTION = "Represent this sentence for searching relevant passages: "


class Embedder:
    def __init__(self, model_name: str, cache_dir: str | None = None):
        self.model_name = model_name
        self._model = TextEmbedding(model_name=model_name, cache_dir=cache_dir)
        self._query_prefix = BGE_QUERY_INSTRUCTION if "bge" in model_name.lower() else ""

    @staticmethod
    def _normalize(vectors: np.ndarray) -> np.ndarray:
        norms = np.linalg.norm(vectors, axis=-1, keepdims=True)
        return vectors / np.clip(norms, 1e-12, None)

    def embed_passages(self, texts: list[str]) -> np.ndarray:
        return self._normalize(np.array(list(self._model.passage_embed(texts)), dtype=np.float32))

    @lru_cache(maxsize=1024)  # noqa: B019 — one embedder per process
    def _embed_query_cached(self, text: str) -> tuple[float, ...]:
        vector = np.array(next(iter(self._model.query_embed(self._query_prefix + text))), dtype=np.float32)
        return tuple(self._normalize(vector).tolist())

    def embed_query(self, text: str) -> list[float]:
        return list(self._embed_query_cached(text.strip()))

    def warm_up(self) -> None:
        """Load the ONNX session now so the first visitor doesn't wait for it."""
        self.embed_query("warm up")
