import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

const suggestions = [
  "Tell me about Aman",
  "What AI/ML projects has he built?",
  "Explain his RAG experience",
  "What technologies does he know?",
];

const Chatbot = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = (text = message) => {
    const value = text.trim();

    if (!value) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: value,
      },
    ]);

    setMessage("");

    // Backend connection comes next.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm Aman's AI assistant. The RAG backend will be connected here next.",
        },
      ]);
    }, 500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm md:hidden"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="fixed bottom-5 right-5 z-[80] flex h-[min(680px,calc(100vh-40px))] w-[min(420px,calc(100vw-40px))] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0c]/95 shadow-2xl shadow-black/60 backdrop-blur-2xl max-md:bottom-0 max-md:right-0 max-md:h-[100dvh] max-md:w-full max-md:rounded-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Sparkles size={17} />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">
                      Aman AI
                    </h3>

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>

                  <p className="text-[11px] text-zinc-600">
                    AI portfolio assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-zinc-600 transition hover:bg-white/5 hover:text-white"
                  aria-label="Minimize chatbot"
                >
                  <ChevronDown size={18} />
                </button>

                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-zinc-600 transition hover:bg-white/5 hover:text-white"
                  aria-label="Close chatbot"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-6">
              {messages.length === 0 ? (
                <div className="flex min-h-full flex-col justify-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400">
                    <Bot size={25} />
                  </div>

                  <h4 className="mt-5 text-center text-xl font-medium tracking-tight text-white">
                    Ask about Aman.
                  </h4>

                  <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-6 text-zinc-600">
                    Ask about his AI/ML experience, projects, skills,
                    education, or software engineering background.
                  </p>

                  <div className="mt-8 space-y-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => sendMessage(suggestion)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-xs text-zinc-400 transition hover:border-violet-400/20 hover:bg-violet-500/5 hover:text-white"
                      >
                        {suggestion}

                        <span className="text-zinc-700">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((item, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        item.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {item.role === "assistant" && (
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                          <Bot size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          item.role === "user"
                            ? "rounded-br-md bg-white text-black"
                            : "rounded-bl-md border border-white/10 bg-white/[0.035] text-zinc-400"
                        }`}
                      >
                        {item.content}
                      </div>

                      {item.role === "user" && (
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2 focus-within:border-violet-400/30"
              >
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask something about Aman..."
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-zinc-700"
                />

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>

              <p className="mt-2 text-center text-[10px] text-zinc-700">
                AI-generated responses based on Aman's portfolio
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;