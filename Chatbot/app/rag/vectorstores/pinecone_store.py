"""Pinecone serverless index. Chunk text is stored as metadata, so a query
returns everything needed to build the prompt in one round trip."""

import logging

import numpy as np
from pinecone import Pinecone, ServerlessSpec

from ..models import Chunk, Match
from .base import Filter

log = logging.getLogger(__name__)
UPSERT_BATCH = 100


class PineconeVectorStore:
    name = "pinecone"

    def __init__(self, api_key: str, index_name: str, namespace: str, dimension: int, cloud: str, region: str):
        self._pc = Pinecone(api_key=api_key)
        self.index_name = index_name
        self.namespace = namespace
        self.dimension = dimension
        self._cloud, self._region = cloud, region
        self._index = None

    @property
    def index(self):
        if self._index is None:
            self._index = self._pc.Index(self.index_name)  # resolves and caches the index host
        return self._index

    def ensure_index(self) -> None:
        """Create the serverless index on first ingest (cosine, matching dimension)."""
        if not self._pc.has_index(self.index_name):
            log.info("Creating Pinecone index %s (%s/%s)", self.index_name, self._cloud, self._region)
            self._pc.create_index(
                name=self.index_name,
                dimension=self.dimension,
                metric="cosine",
                spec=ServerlessSpec(cloud=self._cloud, region=self._region),
            )

    def reset(self) -> None:
        try:
            self.index.delete(delete_all=True, namespace=self.namespace)
        except Exception as exc:  # an empty/new namespace raises "not found"
            log.info("Namespace %s not cleared (%s) — probably empty", self.namespace, exc)

    def upsert(self, chunks: list[Chunk], vectors: np.ndarray) -> None:
        records = [
            # Pinecone rejects empty lists in metadata, so drop them.
            {"id": c.id, "values": v.tolist(), "metadata": {k: val for k, val in c.metadata().items() if val != []}}
            for c, v in zip(chunks, vectors)
        ]
        for start in range(0, len(records), UPSERT_BATCH):
            self.index.upsert(vectors=records[start : start + UPSERT_BATCH], namespace=self.namespace, show_progress=False)

    def query(self, vector: list[float], top_k: int, filter: Filter | None = None) -> list[Match]:
        response = self.index.query(
            vector=vector,
            top_k=top_k,
            filter=filter or None,
            include_metadata=True,
            namespace=self.namespace,
            timeout=5,
        )
        matches = []
        for m in response.matches:
            md = dict(m.metadata or {})
            chunk = Chunk(
                id=m.id,
                text=md.get("text", ""),
                section=md.get("section", ""),
                section_title=md.get("section_title", ""),
                heading=md.get("heading", ""),
                entities=list(md.get("entities", [])),
                page=int(md.get("page", 0)),
            )
            matches.append(Match(chunk=chunk, score=float(m.score)))
        return matches

    def fetch_all(self) -> tuple[list[Chunk], np.ndarray]:
        """Every vector + metadata in the namespace (used to serve queries from memory)."""
        ids = [v.id for page in self.index.list(namespace=self.namespace) for v in page.vectors]
        chunks: list[Chunk] = []
        vectors: list[list[float]] = []
        for start in range(0, len(ids), UPSERT_BATCH):
            response = self.index.fetch(ids=ids[start : start + UPSERT_BATCH], namespace=self.namespace)
            for vid, record in response.vectors.items():
                md = dict(record.metadata or {})
                chunks.append(
                    Chunk(
                        id=vid,
                        text=md.get("text", ""),
                        section=md.get("section", ""),
                        section_title=md.get("section_title", ""),
                        heading=md.get("heading", ""),
                        entities=list(md.get("entities", [])),
                        page=int(md.get("page", 0)),
                    )
                )
                vectors.append(record.values)
        return chunks, np.asarray(vectors, dtype=np.float32)

    def count(self) -> int:
        stats = self.index.describe_index_stats()
        ns = (stats.namespaces or {}).get(self.namespace)
        return int(ns.vector_count) if ns else 0
