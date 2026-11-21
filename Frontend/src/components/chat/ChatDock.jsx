import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, X } from "lucide-react";
import ChatMessage from "./ChatMessage";
import Spinner from "../ui/Spinner";
import { checkAgentHealth, isChatLive, streamAgent } from "../../services/chat.service";
import { cn } from "../../utils/cn";

const MotionPanel = motion.aside;
const HISTORY_MESSAGES = 12;
/** Free hosting can take ~50 s to wake up: keep checking for about a minute. */
const HEALTH_RETRIES = 12;
const HEALTH_RETRY_MS = 5000;

const STATUS = {
  checking: { dot: "bg-dim animate-pulse", text: "Connecting…" },
  online: { dot: "bg-emerald-400", text: "Online · answers only from Aman's knowledge base" },
  waking: { dot: "bg-ember animate-pulse", text: "Waking up the assistant…" },
  offline: { dot: "bg-blaze", text: "Offline right now — use the contact form" },
  notConfigured: { dot: "bg-ember", text: "Knowledge base coming soon" },
};

/** Ping /health when the panel opens; retry for a while if the server is waking up. */
function useAgentStatus(open) {
  const [status, setStatus] = useState(isChatLive ? "checking" : "notConfigured");

  useEffect(() => {
    if (!open || !isChatLive) return;
    let cancelled = false;
    let timer;
    const attempt = async (n) => {
      const ok = await checkAgentHealth();
      if (cancelled) return;
      if (ok) return setStatus("online");
      if (n >= HEALTH_RETRIES) return setStatus("offline");
      setStatus("waking");
      timer = setTimeout(() => attempt(n + 1), HEALTH_RETRY_MS);
    };
    attempt(1);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open]);

  return [status, setStatus];
}

const SUGGESTIONS = [
  "Tell me about yourself",
  "What did Aman build with LangGraph?",
  "How does his YouTube Assistant RAG pipeline work?",
  "Where is he working now?",
];

let nextId = 1;
const newId = () => nextId++;

/** "Ask my agent" panel. Streams answers from the RAG service (Chatbot/). */
export default function ChatDock({ open, onClose, profile }) {
  const [messages, setMessages] = useState(() => [
    {
      id: newId(),
      role: "assistant",
      status: "done",
      text: `Hi! I'm ${profile.firstName}'s AI portfolio assistant. Ask me about his experience, projects, skills or career goals.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useAgentStatus(open);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const update = (id, patch) =>
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...(typeof patch === "function" ? patch(m) : patch) } : m)));

  const send = async (text) => {
    const question = text.trim();
    if (!question || busy) return;

    const history = messages
      .filter((m) => m.status === "done" && m.id !== messages[0].id)
      .slice(-HISTORY_MESSAGES)
      .map(({ role, text: content }) => ({ role, content }));

    const answerId = newId();
    setMessages((list) => [
      ...list,
      { id: newId(), role: "user", status: "done", text: question },
      { id: answerId, role: "assistant", status: "streaming", text: "" },
    ]);
    setInput("");
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await streamAgent({
        question,
        history,
        signal: controller.signal,
        onToken: (token) => update(answerId, (m) => ({ text: m.text + token })),
      });
      update(answerId, (m) => ({ status: "done", text: m.text.trim(), sources: result.sources ?? [] }));
      if (isChatLive) setStatus("online");
    } catch (error) {
      if (error.name === "AbortError") return;
      update(answerId, { status: "error", text: error.message });
      if (error.message.startsWith("Can't reach")) setStatus("offline");
    } finally {
      setBusy(false);
    }
  };

  const showSuggestions = messages.length === 1;

  return (
    <AnimatePresence>
      {open && (
        <MotionPanel
          role="dialog"
          aria-label={`Chat with ${profile.firstName}'s AI assistant`}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed right-3 bottom-20 z-[80] flex h-[min(560px,74svh)] w-[min(390px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line-strong bg-ink-2 shadow-2xl shadow-black/70 sm:right-5"
        >
          <header className="flex items-center gap-3 border-b border-line px-4 py-3">
            <img src={profile.portraitUrl} alt="" className="h-9 w-9 rounded-full bg-ink-3 object-cover object-top" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Ask my agent</p>
              <p className="flex items-center gap-1.5 font-mono text-[10px] text-dim" role="status">
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS[status].dot)} />
                {STATUS[status].text}
              </p>
            </div>
            <button type="button" onClick={onClose} className="rounded-md p-1.5 text-mute hover:bg-white/5 hover:text-fg" aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4" aria-live="polite" aria-busy={busy}>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {showSuggestions && (
              <div className="mt-1 flex flex-col items-start gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-mute transition-colors hover:border-agent hover:text-fg"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line p-3"
          >
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, skills, experience…"
              maxLength={500}
              autoComplete="off"
              className="flex-1 rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-fg placeholder:text-dim focus:border-agent focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blaze text-white transition-colors hover:bg-ember disabled:opacity-40"
              aria-label={busy ? "Waiting for the answer" : "Send"}
            >
              {busy ? <Spinner size={16} /> : <ArrowUp size={17} />}
            </button>
          </form>
        </MotionPanel>
      )}
    </AnimatePresence>
  );
}
