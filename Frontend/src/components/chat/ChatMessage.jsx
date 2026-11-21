import { cn } from "../../utils/cn";

const URL_RE = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g;
const BOLD_RE = /\*\*(.+?)\*\*/g;

/** Plain text with URLs and emails turned into links. */
function Linkified({ text }) {
  return text.split(URL_RE).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") && !part.startsWith("http") ? `mailto:${part}` : part;
    return (
      <a key={i} href={href} target="_blank" rel="noreferrer" className="break-all underline underline-offset-2 hover:text-agent">
        {part}
      </a>
    );
  });
}

/** Minimal formatting for model output: **bold** + links. Everything else stays plain text. */
function FormattedText({ text }) {
  return text.split(BOLD_RE).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        <Linkified text={part} />
      </strong>
    ) : (
      <Linkified key={i} text={part} />
    ),
  );
}

export function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" aria-label="The assistant is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-mute" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

export default function ChatMessage({ message }) {
  const mine = message.role === "user";
  const waiting = message.status === "streaming" && !message.text;

  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          mine && "rounded-br-sm bg-blaze text-white",
          !mine && message.status !== "error" && "rounded-bl-sm border border-line bg-ink text-fg",
          message.status === "error" && "rounded-bl-sm border border-blaze/40 bg-blaze/10 text-fg",
        )}
      >
        {waiting ? <TypingDots /> : <FormattedText text={message.text} />}
        {message.status === "streaming" && message.text && (
          <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-agent" aria-hidden="true" />
        )}
      </div>
      {message.sources?.length > 0 && (
        <p className="mt-1.5 max-w-[88%] px-1 font-mono text-[10px] leading-relaxed text-dim">
          From: {message.sources.map((s) => s.title).join(" · ")}
        </p>
      )}
    </div>
  );
}
