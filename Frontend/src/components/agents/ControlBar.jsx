import { FastForward, MessageCircle, RotateCcw } from "lucide-react";
import { MODE } from "../../lib/assembly/createAssemblyStore";
import { useAssemblyStore, useAssemblySummary } from "../../hooks/useAssembly";
import { SWARM } from "../../constants/site";
import { cn } from "../../utils/cn";

const AGENT_DOTS = ["#f2242f", "#ff5a1f", "#22d3ee", "#f5f5f4", "#a1a1aa"];

function statusText({ mode, busy }) {
  if (mode === MODE.INTRO) return "Booting";
  if (mode === MODE.SKIPPED) return "Paused";
  if (mode === MODE.COMPLETE) return "All live";
  return busy ? "Assembling" : "Scroll to build";
}

/** Bottom dock: agent count, build progress, skip/replay and the chat entry point. */
export default function ControlBar({ onOpenChat, chatOpen }) {
  const store = useAssemblyStore();
  const summary = useAssemblySummary();
  const { mode, done, total } = summary;
  const running = mode === MODE.INTRO || mode === MODE.BUILDING;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const agents =
    typeof window !== "undefined" && window.innerWidth < SWARM.mobileBreakpoint
      ? SWARM.agentsMobile
      : SWARM.agentsDesktop;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3">
      <div className="flex items-center gap-2 rounded-full border border-line-strong bg-ink-2/85 py-1.5 pr-1.5 pl-3 shadow-2xl shadow-black/60 backdrop-blur-md sm:gap-3">
        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex -space-x-1.5" aria-hidden="true">
            {AGENT_DOTS.map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full border-2 border-ink-2"
                style={{ background: color }}
              />
            ))}
          </div>
          <span className="hidden font-mono text-[11px] text-mute sm:inline">{agents} agents</span>
        </div>

        <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden="true" />

        <div className="flex items-center gap-2" aria-live="polite">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              running ? "animate-pulse bg-agent" : mode === MODE.COMPLETE ? "bg-emerald-400" : "bg-dim",
            )}
          />
          <span className="font-mono text-[11px] whitespace-nowrap text-fg">{statusText(summary)}</span>
          <span className="hidden font-mono text-[11px] whitespace-nowrap text-dim md:inline">
            {done}/{total} commits
          </span>
          <span className="hidden h-1 w-16 overflow-hidden rounded-full bg-line-strong sm:block" aria-hidden="true">
            <span className="block h-full bg-agent transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </span>
        </div>

        {running ? (
          <button
            type="button"
            onClick={store.skip}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-[11px] text-mute transition-colors hover:bg-white/5 hover:text-fg"
            aria-label="Skip the animation and show everything"
          >
            <FastForward size={13} />
            <span className="hidden sm:inline">Skip</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={store.replay}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 font-mono text-[11px] text-mute transition-colors hover:bg-white/5 hover:text-fg"
            aria-label="Replay the agents building this page"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Replay</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenChat}
          aria-expanded={chatOpen}
          className="flex items-center gap-1.5 rounded-full bg-blaze px-3.5 py-2 text-xs font-semibold whitespace-nowrap text-white transition-colors hover:bg-ember"
        >
          <MessageCircle size={14} />
          <span>Ask my agent</span>
        </button>
      </div>
    </div>
  );
}
