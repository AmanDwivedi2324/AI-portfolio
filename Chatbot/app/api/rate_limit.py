"""Per-IP sliding-window rate limit (in memory — fine for a single instance).

Protects the Groq quota from abuse of a public endpoint.
"""

import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from ..config import get_settings


class RateLimiter:
    def __init__(self, limit: int, window_seconds: int):
        self.limit, self.window = limit, window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str) -> None:
        now = time.monotonic()
        hits = self._hits[key]
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if len(hits) >= self.limit:
            retry = int(self.window - (now - hits[0])) + 1
            raise HTTPException(
                status_code=429,
                detail="You're sending messages too quickly. Please wait a moment.",
                headers={"Retry-After": str(retry)},
            )
        hits.append(now)
        if len(self._hits) > 10_000:  # forget idle clients
            for k in [k for k, v in self._hits.items() if not v]:
                del self._hits[k]


def client_ip(request: Request) -> str:
    if get_settings().trust_proxy and (forwarded := request.headers.get("x-forwarded-for")):
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
