import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  ChevronDown,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const suggestions = [
  "Tell me about Aman",
  "What AI/ML projects has he built?",
  "Explain his RAG experience",
  "What technologies does he know?",
];

const Chatbot = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (text = message) => {
    const value = text.trim();

    if (!value || isLoading) return;

    // Add user message and empty assistant message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: value,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}`
        );
      }

      if (!response.body) {
        throw new Error("Streaming is not supported by this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let answer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        answer += chunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: answer,
          };

          return updated;
        });
      }

      // Flush any remaining decoder content
      const finalChunk = decoder.decode();

      if (finalChunk) {
        answer += finalChunk;

        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1] = {
            role: "assistant",
            content: answer,
          };

          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "I couldn't connect to the AI assistant right now. Please try again.",
        };

        return updated;
      });
    } finally {
      setIsLoading(false);
    }
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
                        disabled={isLoading}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-xs text-zinc-400 transition hover:border-violet-400/20 hover:bg-violet-500/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {suggestion}

                        <span className="text-zinc-700">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((item, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${item.role === "user"
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
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${item.role === "user"
                            ? "rounded-br-md bg-white leading-6 text-black"
                            : "rounded-bl-md border border-white/10 bg-white/[0.035] leading-6 text-zinc-400"
                          }`}
                      >
                        {item.role === "assistant" ? (
                          item.content ? (
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="mb-3 text-lg font-semibold text-white">
                                    {children}
                                  </h1>
                                ),

                                h2: ({ children }) => (
                                  <h2 className="mb-3 mt-1 text-base font-semibold text-white">
                                    {children}
                                  </h2>
                                ),

                                h3: ({ children }) => (
                                  <h3 className="mb-2 mt-4 text-sm font-semibold text-white">
                                    {children}
                                  </h3>
                                ),

                                p: ({ children }) => (
                                  <p className="mb-3 leading-6 text-zinc-400 last:mb-0">
                                    {children}
                                  </p>
                                ),

                                strong: ({ children }) => (
                                  <strong className="font-semibold text-white">
                                    {children}
                                  </strong>
                                ),

                                ul: ({ children }) => (
                                  <ul className="mb-3 ml-4 list-disc space-y-1.5 text-zinc-400">
                                    {children}
                                  </ul>
                                ),

                                ol: ({ children }) => (
                                  <ol className="mb-3 ml-4 list-decimal space-y-1.5 text-zinc-400">
                                    {children}
                                  </ol>
                                ),

                                li: ({ children }) => (
                                  <li className="pl-1 leading-6">
                                    {children}
                                  </li>
                                ),

                                code: ({ children }) => (
                                  <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-violet-300">
                                    {children}
                                  </code>
                                ),

                                a: ({ children, href }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {item.content}
                            </ReactMarkdown>
                          ) : (
                            <div className="flex items-center gap-1 py-1">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />

                              <span
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"
                                style={{
                                  animationDelay: "100ms",
                                }}
                              />

                              <span
                                className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"
                                style={{
                                  animationDelay: "200ms",
                                }}
                              />
                            </div>
                          )
                        ) : (
                          item.content
                        )}
                      </div>

                      {item.role === "user" && (
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-zinc-500">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
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
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  disabled={isLoading}
                  placeholder="Ask something about Aman..."
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-zinc-700 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
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