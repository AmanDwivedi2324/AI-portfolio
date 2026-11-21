"""BM25 keyword ranking over the chunks (in-process, microseconds).

Embeddings capture meaning but can miss exact terms such as "CGPA",
"Kafka" or "MillionVerifier". Mixing in BM25 makes those questions land on
the chunk that literally contains the term.
"""

import math
import re
from collections import Counter

from .models import Chunk

_STOPWORDS = set(
    """a an the and or but if of to in on at by for with from as is are was were be been being do does did
    has have had he his him she her they them their it its this that these those what which who whom whose
    how why where when can could would should will shall may might must about into over under than then so
    such not no yes you your i me my we our us aman dwivedi tell give please""".split()
)
_TOKEN = re.compile(r"[a-z0-9][a-z0-9.+#-]*[a-z0-9+#]|[a-z0-9]")


def _stem(token: str) -> str:
    for suffix in ("ingly", "ing", "edly", "ed", "ly", "es", "s"):
        if len(token) > len(suffix) + 3 and token.endswith(suffix):
            return token[: -len(suffix)]
    return token


def tokenize(text: str) -> list[str]:
    return [_stem(t) for t in _TOKEN.findall(text.lower()) if t not in _STOPWORDS]


class BM25Index:
    def __init__(self, chunks: list[Chunk], k1: float = 1.2, b: float = 0.75):
        self.chunks = chunks
        self.k1, self.b = k1, b
        self.docs = [Counter(tokenize(c.text)) for c in chunks]
        self.lengths = [sum(d.values()) for d in self.docs]
        self.avg_len = sum(self.lengths) / max(len(self.lengths), 1)
        df = Counter(term for doc in self.docs for term in doc)
        n = len(self.docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}

    def scores(self, query: str) -> list[float]:
        terms = [t for t in set(tokenize(query)) if t in self.idf]
        out = []
        for doc, length in zip(self.docs, self.lengths):
            s = 0.0
            for t in terms:
                tf = doc.get(t, 0)
                if tf:
                    s += self.idf[t] * tf * (self.k1 + 1) / (tf + self.k1 * (1 - self.b + self.b * length / self.avg_len))
            out.append(s)
        return out

    def top(self, query: str, k: int) -> list[tuple[Chunk, float]]:
        """Top-k chunks with scores normalised to 0–1 (1 = best match for this query)."""
        raw = self.scores(query)
        best = max(raw, default=0.0)
        if best <= 0:
            return []
        ranked = sorted(zip(self.chunks, raw), key=lambda x: x[1], reverse=True)[:k]
        return [(c, s / best) for c, s in ranked if s > 0]
