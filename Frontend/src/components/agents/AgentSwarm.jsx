import { useEffect, useRef, useState } from "react";
import { Director } from "../../lib/assembly/Director";
import { MODE } from "../../lib/assembly/createAssemblyStore";
import { useAssemblyStore, useAssemblySummary } from "../../hooks/useAssembly";
import { SWARM } from "../../constants/site";
import LogoMark from "../ui/LogoMark";
import { agentName } from "../../lib/assembly/agentName";

const pickAgentCount = () =>
  window.innerWidth < SWARM.mobileBreakpoint ? SWARM.agentsMobile : SWARM.agentsDesktop;

/**
 * Agent pointer: red with a white outline and a red glow (see `.agent__cursor`
 * in index.css), so it never looks like the visitor's own white cursor.
 */
function CursorIcon() {
  return (
    <svg className="agent__cursor" width="16" height="20" viewBox="0 0 18 22" fill="none" aria-hidden="true">
      <path
        d="M1.5 1.5 L16 13.2 L9.6 14 L13.4 20.6 L10.6 21.8 L6.9 15.1 L1.5 19.6 Z"
        fill="#f2242f"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Renders the agent cursors and hands them to the Director, which moves them
 * imperatively. Also shows the logo the agents gather around during the intro.
 */
export default function AgentSwarm() {
  const store = useAssemblyStore();
  const { mode } = useAssemblySummary();
  const [count] = useState(pickAgentCount);
  const refs = useRef([]);
  const directorRef = useRef(null);

  // Create the director once the cursor nodes exist.
  useEffect(() => {
    const agents = refs.current.slice(0, count).map((el, i) => ({ name: agentName(i), el }));
    const director = new Director(store, agents, SWARM);
    directorRef.current = director;

    const wake = () => director.wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      director.stop();
      directorRef.current = null;
    };
  }, [store, count]);

  // Start on load and on every replay; stop when skipped.
  useEffect(() => {
    const director = directorRef.current;
    if (!director) return;
    if (mode === MODE.INTRO) director.start();
    if (mode === MODE.SKIPPED) director.stop();
  }, [mode]);

  return (
    <div className="swarm" data-hidden={mode === MODE.SKIPPED} aria-hidden="true">
      <div
        className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: mode === MODE.INTRO ? 1 : 0 }}
      >
        <div className="flex flex-col items-center gap-5">
          <span className="pulse-ring rounded-2xl">
            <LogoMark className="h-14 w-14" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
            Spinning up {count} agents
          </span>
        </div>
      </div>

      {Array.from({ length: count }, (_, i) => (
        <div key={i} ref={(el) => (refs.current[i] = el)} className="agent">
          <CursorIcon />
          <span className="agent__tag">{agentName(i)}</span>
        </div>
      ))}
    </div>
  );
}
