import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import PortfolioProvider from "../contexts/PortfolioProvider";
import AssemblyProvider from "../contexts/AssemblyProvider";
import usePortfolio from "../hooks/usePortfolio";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import BootScreen from "../components/layout/BootScreen";
import AgentSwarm from "../components/agents/AgentSwarm";
import ControlBar from "../components/agents/ControlBar";
import ChatDock from "../components/chat/ChatDock";

function PortfolioShell() {
  const { data, loading, error } = usePortfolio();
  const [chatOpen, setChatOpen] = useState(false);
  const toggleChat = useCallback(() => setChatOpen((open) => !open), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  if (loading) return <BootScreen />;

  if (error || !data) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-ink px-6 text-center">
        <p className="font-display text-4xl uppercase">Something broke.</p>
        <p className="text-mute">The content could not be loaded. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh bg-ink text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-fg focus:px-3 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar firstName={data.profile.firstName} />
      <main id="main">
        <Outlet context={data} />
      </main>
      <Footer profile={data.profile} />

      <AgentSwarm />
      <ControlBar onOpenChat={toggleChat} chatOpen={chatOpen} />
      <ChatDock open={chatOpen} onClose={closeChat} profile={data.profile} />
    </div>
  );
}

export default function PortfolioLayout() {
  return (
    <PortfolioProvider>
      <AssemblyProvider>
        <PortfolioShell />
      </AssemblyProvider>
    </PortfolioProvider>
  );
}
