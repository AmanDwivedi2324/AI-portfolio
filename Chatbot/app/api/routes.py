import json
import logging
import secrets
from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from fastapi.responses import StreamingResponse

from ..bootstrap import reload_index
from ..services.chat_service import ChatService
from .rate_limit import client_ip
from .schemas import ChatRequest, ChatResponse

log = logging.getLogger("api")
router = APIRouter()


def get_chat(request: Request) -> ChatService:
    return request.app.state.chat


def rate_limited(request: Request) -> None:
    request.app.state.rate_limiter.check(client_ip(request))


@router.get("/health")
def health(request: Request) -> dict:
    state = request.app.state
    return {
        "status": "ok",
        "vector_store": state.store_name,
        "chunks": state.chunk_count,
        "embedding_model": state.settings.embedding_model,
        "llm_model": state.settings.groq_model if state.chat.llm else None,
    }


@router.post("/admin/reload")
def reload(request: Request, authorization: str | None = Header(default=None)) -> dict:
    """Reload the index after a knowledge-base update. Needs `Authorization: Bearer <ADMIN_TOKEN>`."""
    token = request.app.state.settings.admin_token
    if not token:
        raise HTTPException(status_code=404, detail="Not found")
    if not secrets.compare_digest(authorization or "", f"Bearer {token}"):
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return reload_index(request.app)


@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(rate_limited)])
async def chat(body: ChatRequest, service: ChatService = Depends(get_chat)) -> dict:
    try:
        return await service.answer(body.question, [h.model_dump() for h in body.history])
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        log.exception("chat failed")
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable.") from exc


@router.post("/chat/stream", dependencies=[Depends(rate_limited)])
async def chat_stream(body: ChatRequest, service: ChatService = Depends(get_chat)) -> StreamingResponse:
    """Server-Sent Events: one `data: {json}` line per event (token / done / error)."""

    async def events() -> AsyncIterator[str]:
        try:
            async for event in service.stream(body.question, [h.model_dump() for h in body.history]):
                yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        except Exception:
            log.exception("stream failed")
            yield f"data: {json.dumps({'type': 'error', 'message': 'The assistant is temporarily unavailable. Please try again.'})}\n\n"

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
