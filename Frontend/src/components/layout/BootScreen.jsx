import { useEffect, useState } from "react";
import LogoMark from "../ui/LogoMark";

/**
 * Shown while the content loads. Looks like the agents' intro, and explains
 * the wait if the free-tier server is still waking up.
 */
export default function BootScreen() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-ink" role="status" aria-live="polite">
      <span className="pulse-ring rounded-2xl">
        <LogoMark className="h-14 w-14" />
      </span>
      <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
        {slow ? "Waking up the server…" : "Loading"}
      </span>
    </div>
  );
}
