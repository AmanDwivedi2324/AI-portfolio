"""FastAPI entry point.

    uvicorn app.main:app --reload --port 8000
"""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

from .api.routes import router  # noqa: E402
from .bootstrap import build_services  # noqa: E402
from .config import get_settings  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
for noisy in ("httpx", "httpcore", "huggingface_hub", "fastembed", "pinecone"):
    logging.getLogger(noisy).setLevel(logging.WARNING)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not getattr(app.state, "chat", None):  # tests inject their own services
        build_services(app, get_settings())
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Aman's portfolio assistant", version="1.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        max_age=600,
    )
    app.include_router(router)
    return app


app = create_app()

__all__ = ["app", "create_app", "build_services"]
