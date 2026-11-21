/**
 * "Ask my agent" client for the FastAPI RAG service (Chatbot/).
 * Answers are streamed with Server-Sent Events so words appear as soon as
 * the model produces them.
 */
const CHAT_API_URL = (import.meta.env.VITE_CHAT_API_URL || "").replace(/\/$/, "");

export const isChatLive = Boolean(CHAT_API_URL);

export class ChatError extends Error {}

const NOT_LIVE_ANSWER =
  "My knowledge base is still being set up, so I can't answer that yet. In the meantime, you can reach Aman through the contact form on this page.";

async function errorFrom(response) {
  if (response.status === 429) return new ChatError("You're sending messages too quickly. Please wait a moment.");
  if (response.status === 422) return new ChatError("Please keep your question under 500 characters.");
  const data = await response.json().catch(() => null);
  return new ChatError(typeof data?.detail === "string" ? data.detail : "The assistant is temporarily unavailable.");
}

/**
 * Ask a question. `onToken(text)` is called for every streamed piece of the
 * answer; resolves with { sources, refused, cached, timings }.
 */
export async function streamAgent({ question, history = [], signal, onToken }) {
  if (!isChatLive) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    onToken(NOT_LIVE_ANSWER);
    return { sources: [], refused: false };
  }

  let response;
  try {
    response = await fetch(`${CHAT_API_URL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ChatError("Can't reach the assistant right now. Please try again in a moment.");
  }
  if (!response.ok) throw await errorFrom(response);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let final = null;

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const line = frame.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const event = JSON.parse(line.slice(6));
      if (event.type === "token") onToken(event.text);
      else if (event.type === "done") final = event;
      else if (event.type === "error") throw new ChatError(event.message);
    }
  }
  return final ?? { sources: [], refused: false };
}
