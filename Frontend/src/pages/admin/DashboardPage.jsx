import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import PageHeader from "../../components/admin/PageHeader";
import useAuth from "../../hooks/useAuth";
import { fetchDashboard } from "../../services/admin/admin.service";

const CARDS = [
  { key: "projects", label: "Projects", to: "/admin/projects" },
  { key: "skills", label: "Skills", to: "/admin/skills" },
  { key: "experience", label: "Roles", to: "/admin/experience" },
  { key: "education", label: "Education", to: "/admin/education" },
  { key: "process", label: "Process steps", to: "/admin/process" },
  { key: "unread", label: "Unread messages", to: "/admin/messages", accent: true },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard().then(setData).catch(setError);
  }, []);

  return (
    <>
      <PageHeader
        title={`Hi, ${user?.username ?? "there"}`}
        description="Everything you change here goes live on the site as soon as you save."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-md border border-line px-4 py-2.5 text-sm text-mute hover:text-fg">
            View site <ArrowUpRight size={15} />
          </a>
        }
      />

      {error && <p className="rounded-lg border border-blaze/40 bg-blaze/10 p-4 text-sm">{error.message}</p>}
      {!data && !error && (
        <p className="flex items-center gap-2 text-sm text-mute">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {CARDS.map((card) => (
              <Link key={card.key} to={card.to} className="group rounded-lg border border-line bg-ink-2 p-5 transition-colors hover:border-line-strong">
                <p className={`font-display text-5xl ${card.accent && data.counts.unread > 0 ? "text-blaze" : "text-fg"}`}>
                  {data.counts[card.key]}
                </p>
                <p className="mt-1 flex items-center justify-between text-sm text-mute">
                  {card.label}
                  <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
              </Link>
            ))}
          </div>

          <section className="mt-8 rounded-lg border border-line bg-ink-2">
            <header className="flex items-center justify-between border-b border-line px-5 py-3">
              <h2 className="text-sm font-semibold">Latest messages</h2>
              <Link to="/admin/messages" className="text-xs text-mute hover:text-fg">
                Open inbox →
              </Link>
            </header>
            {data.recentMessages.length === 0 ? (
              <p className="px-5 py-6 text-sm text-dim">No messages yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {data.recentMessages.map((m) => (
                  <li key={m._id} className="flex items-baseline gap-3 px-5 py-3 text-sm">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-line-strong" : "bg-blaze"}`} />
                    <span className="shrink-0 font-medium">{m.name}</span>
                    <span className="truncate text-mute">{m.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  );
}
