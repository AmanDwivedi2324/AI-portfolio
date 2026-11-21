import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListOrdered,
  Loader2,
  LogOut,
  Menu,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import LogoMark from "../components/ui/LogoMark";
import useAuth from "../hooks/useAuth";
import { fetchDashboard, MESSAGES_CHANGED_EVENT } from "../services/admin/admin.service";
import { cn } from "../utils/cn";

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/profile", label: "Profile & site", Icon: UserRound },
  { to: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { to: "/admin/skills", label: "Skills", Icon: Wrench },
  { to: "/admin/experience", label: "Experience", Icon: Briefcase },
  { to: "/admin/education", label: "Education", Icon: GraduationCap },
  { to: "/admin/process", label: "Process", Icon: ListOrdered },
  { to: "/admin/messages", label: "Messages", Icon: Inbox, badge: "unread" },
  { to: "/admin/account", label: "Account", Icon: KeyRound },
];

function Sidebar({ unread, onNavigate, onSignOut }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="CRM">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <LogoMark className="h-7 w-7" />
        <span className="font-display text-lg tracking-wide uppercase">Portfolio CRM</span>
      </div>
      {NAV.map((item) => {
        const { to, label, end, badge } = item;
        const Icon = item.Icon;
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-white/[0.07] text-fg" : "text-mute hover:bg-white/[0.03] hover:text-fg",
              )
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {badge === "unread" && unread > 0 && (
              <span className="rounded-full bg-blaze px-1.5 py-0.5 font-mono text-[10px] text-white">{unread}</span>
            )}
          </NavLink>
        );
      })}
      <div className="mt-auto flex flex-col gap-1 border-t border-line pt-4">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-mute hover:text-fg">
          <ExternalLink size={16} /> View site
        </a>
        <button type="button" onClick={onSignOut} className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-mute hover:text-blaze">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </nav>
  );
}

/** Signed-in shell of the CRM. Redirects to /admin/login when signed out. */
export default function AdminLayout() {
  const { status, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Refresh the unread badge on every page change and whenever a message changes.
  useEffect(() => {
    if (status !== "signedIn") return;
    const refresh = () =>
      fetchDashboard()
        .then((d) => setUnread(d.counts.unread))
        .catch(() => {});
    refresh();
    window.addEventListener(MESSAGES_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(MESSAGES_CHANGED_EVENT, refresh);
  }, [status, location.pathname]);

  if (status === "checking") {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ink text-mute">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (status === "signedOut") return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;

  return (
    <div className="min-h-svh bg-ink text-fg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-line bg-ink-2 md:block">
        <Sidebar unread={unread} onSignOut={signOut} />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink/90 px-4 py-3 backdrop-blur md:hidden">
        <span className="flex items-center gap-2 font-display text-lg uppercase">
          <LogoMark className="h-6 w-6" /> CRM
        </span>
        <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="p-1.5">
          <Menu size={22} />
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/60" />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-line bg-ink-2">
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="absolute top-4 right-3 p-1 text-mute">
              <X size={20} />
            </button>
            <Sidebar unread={unread} onNavigate={() => setMenuOpen(false)} onSignOut={signOut} />
          </aside>
        </div>
      )}

      <main className="px-5 py-8 sm:px-8 md:ml-60 md:py-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
