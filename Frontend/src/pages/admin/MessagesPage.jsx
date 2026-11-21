import { useEffect, useState } from "react";
import { Loader2, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/admin/PageHeader";
import { deleteMessage, listMessages, markMessage } from "../../services/admin/admin.service";
import { cn } from "../../utils/cn";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

/** Inbox for the public contact form. */
export default function MessagesPage() {
  const [status, setStatus] = useState("all");
  const [messages, setMessages] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let cancelled = false; // ignore a slow response after switching tabs
    listMessages(status)
      .then((list) => !cancelled && setMessages(list))
      .catch((error) => {
        if (cancelled) return;
        toast.error(error.message);
        setMessages([]);
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const setRead = async (message, read) => {
    try {
      const saved = await markMessage(message._id, read);
      setMessages((list) => list.map((m) => (m._id === saved._id ? saved : m)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const open = (message) => {
    setOpenId(openId === message._id ? null : message._id);
    if (!message.read) setRead(message, true);
  };

  const remove = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}? This can't be undone.`)) return;
    try {
      await deleteMessage(message._id);
      setMessages((list) => list.filter((m) => m._id !== message._id));
      toast.success("Deleted.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <PageHeader title="Messages" description="Everything sent through the contact form, newest first." />

      <div className="mb-4 flex gap-1" role="tablist" aria-label="Filter messages">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={status === f.value}
            onClick={() => {
              setMessages(null);
              setStatus(f.value);
            }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-colors",
              status === f.value ? "bg-fg text-ink" : "text-mute hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!messages && (
        <p className="flex items-center gap-2 text-sm text-mute">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </p>
      )}

      {messages?.length === 0 && (
        <div className="rounded-lg border border-dashed border-line-strong p-10 text-center text-sm text-mute">No messages here.</div>
      )}

      {messages?.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-ink-2">
          {messages.map((m) => (
            <li key={m._id}>
              <button type="button" onClick={() => open(m)} className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02]" aria-expanded={openId === m._id}>
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", m.read ? "bg-transparent" : "bg-blaze")} aria-label={m.read ? "Read" : "Unread"} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={cn("text-sm", m.read ? "text-mute" : "font-semibold text-fg")}>{m.name}</span>
                    <span className="font-mono text-[11px] text-dim">{formatDate(m.createdAt)}</span>
                  </span>
                  <span className="block truncate text-xs text-dim">{m.email}</span>
                  {openId !== m._id && <span className="mt-1 block truncate text-sm text-mute">{m.message}</span>}
                </span>
              </button>
              {openId === m._id && (
                <div className="px-9 pb-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{m.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                      className="flex items-center gap-1.5 rounded-md bg-blaze px-3 py-2 text-xs font-semibold text-white hover:bg-ember"
                    >
                      <Reply size={13} /> Reply by email
                    </a>
                    <button type="button" onClick={() => setRead(m, !m.read)} className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-mute hover:text-fg">
                      {m.read ? <Mail size={13} /> : <MailOpen size={13} />} Mark as {m.read ? "unread" : "read"}
                    </button>
                    <button type="button" onClick={() => remove(m)} className="flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-mute hover:text-blaze">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
