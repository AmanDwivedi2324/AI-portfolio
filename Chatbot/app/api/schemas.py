from typing import Literal

from pydantic import BaseModel, Field, field_validator


class HistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=500)
    history: list[HistoryItem] = Field(default_factory=list, max_length=20)

    @field_validator("question")
    @classmethod
    def not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Question must not be empty")
        return value.strip()


class Source(BaseModel):
    title: str
    section: str


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source] = []
    refused: bool = False
    cached: bool = False
    timings: dict = {}
