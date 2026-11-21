"""Groq chat completions (OpenAI-compatible API on LPU hardware — very fast)."""

from collections.abc import AsyncIterator
from typing import Protocol

from groq import AsyncGroq

from ..config import Settings


class LLM(Protocol):
    model: str

    def stream(self, messages: list[dict]) -> AsyncIterator[str]: ...


class GroqLLM:
    def __init__(self, settings: Settings):
        self.model = settings.groq_model
        self._client = AsyncGroq(api_key=settings.groq_api_key, timeout=30.0, max_retries=1)
        self._params: dict = {
            "model": settings.groq_model,
            "temperature": settings.llm_temperature,
            "max_completion_tokens": settings.llm_max_tokens,
        }
        # Reasoning models: keep thinking short and out of the streamed text.
        if settings.groq_model.startswith("openai/gpt-oss"):
            self._params |= {"reasoning_effort": settings.llm_reasoning_effort, "include_reasoning": False}
        elif "qwen" in settings.groq_model:
            self._params |= {"reasoning_format": "hidden"}

    async def stream(self, messages: list[dict]) -> AsyncIterator[str]:
        response = await self._client.chat.completions.create(messages=messages, stream=True, **self._params)
        async for chunk in response:
            if chunk.choices and (text := chunk.choices[0].delta.content):
                yield text
