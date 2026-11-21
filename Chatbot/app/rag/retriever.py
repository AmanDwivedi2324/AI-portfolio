"""Hybrid retrieval: dense (embeddings) + metadata filters + BM25, with a
relevance gate.

1. The question is embedded locally (~10 ms).
2. If the router produced a metadata filter, a filtered and an open vector
   search run in parallel (same latency as one). Filtered hits get a small
   boost, so filters sharpen precision but never hide a relevant chunk that
   lives in another section (e.g. "Kafka" sits under Interests, not Skills).
3. BM25 keyword scores are mixed in so exact terms (CGPA, Kafka) count.
4. Relevance gate: if the best dense score is below the threshold, the
   question is out of scope → refuse without calling the LLM. Questions the
   router recognises as being about Aman's work get a lower threshold.
"""

import asyncio
from dataclasses import dataclass

from ..config import Settings
from .embeddings import Embedder
from .lexical import BM25Index
from .models import Chunk, Match
from .router import Route
from .vectorstores.base import VectorStore, matches_filter

LEXICAL_WEIGHT = 0.12
LEXICAL_CANDIDATES = 3


@dataclass
class Retrieval:
    matches: list[Match]  # chunks for the prompt, best first; empty = out of scope
    best_score: float  # best dense (cosine) similarity
    used_filter: bool


class Retriever:
    def __init__(
        self,
        embedder: Embedder,
        store: VectorStore,
        settings: Settings,
        corpus: list[Chunk] | None = None,
        fallback: VectorStore | None = None,
    ):
        self.embedder = embedder
        self.store = store
        self.fallback = fallback
        self.settings = settings
        self.bm25 = BM25Index(corpus) if corpus else None

    def threshold_for(self, route: Route) -> float:
        base = self.settings.relevance_threshold
        if route.entities:
            return base - 0.12
        if route.categories:
            return base - 0.03
        return base

    async def _search(self, vector: list[float], flt) -> list[Match]:
        try:
            return await asyncio.to_thread(self.store.query, vector, self.settings.top_k, flt)
        except Exception:
            if self.fallback is None:
                raise
            return await asyncio.to_thread(self.fallback.query, vector, self.settings.top_k, flt)

    async def retrieve(self, route: Route) -> Retrieval:
        s = self.settings
        vector = await asyncio.to_thread(self.embedder.embed_query, route.retrieval_query)

        flt = route.filter
        if flt:
            filtered, open_ = await asyncio.gather(self._search(vector, flt), self._search(vector, None))
        else:
            filtered, open_ = [], await self._search(vector, None)

        dense: dict[str, Match] = {m.chunk.id: m for m in open_}
        for m in filtered:
            if m.chunk.id not in dense or m.score > dense[m.chunk.id].score:
                dense[m.chunk.id] = m
            dense[m.chunk.id].filtered = True

        best_dense = max((m.score for m in dense.values()), default=0.0)
        if best_dense < self.threshold_for(route):
            return Retrieval(matches=[], best_score=best_dense, used_filter=bool(flt))

        # Fuse: dense score + filter boost + weighted BM25.
        lexical = dict()
        if self.bm25:
            for chunk, score in self.bm25.top(route.retrieval_query, LEXICAL_CANDIDATES):
                lexical[chunk.id] = (chunk, score)
        floor = min((m.score for m in dense.values()), default=0.0)
        fused: dict[str, Match] = {}
        for cid in set(dense) | set(lexical):
            if cid in dense:
                base = dense[cid]
            else:
                chunk = lexical[cid][0]
                base = Match(chunk=chunk, score=floor, filtered=matches_filter(chunk.metadata(), flt))
            score = base.score + (s.filter_boost if base.filtered else 0.0) + LEXICAL_WEIGHT * lexical.get(cid, (None, 0.0))[1]
            fused[cid] = Match(chunk=base.chunk, score=score, filtered=base.filtered)

        ranked = sorted(fused.values(), key=lambda m: m.score, reverse=True)
        top = ranked[0].score
        context = [m for m in ranked if m.score >= top - s.context_score_window]
        if len(context) < s.min_context_chunks:
            # Give the model a little more to work with (e.g. the project chunk
            # behind a summary that only mentions the project in passing).
            context = ranked[: s.min_context_chunks]
        return Retrieval(matches=context[: s.top_k], best_score=best_dense, used_filter=bool(flt))
