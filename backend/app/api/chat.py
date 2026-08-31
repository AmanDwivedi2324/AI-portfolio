from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag import ask_portfolio

router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)

class ChatRequest(BaseModel):
    question:str 


class ChatResponse(BaseModel):
    answer:str 

@router.post("/chat",response_model=ChatResponse)
def chat(request: ChatRequest):
    answer = ask_portfolio(
        request.question
    )

    return ChatResponse(
        answer = answer
    )

