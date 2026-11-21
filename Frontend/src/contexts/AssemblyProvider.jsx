import { useEffect, useState } from "react";
import { AssemblyContext } from "./assemblyContext";
import { createAssemblyStore, MODE } from "../lib/assembly/createAssemblyStore";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Last-resort guard: if the intro never hands over to the agents, show the page. */
const INTRO_WATCHDOG_MS = 6000;

export default function AssemblyProvider({ children }) {
  const [store] = useState(() => createAssemblyStore({ startSkipped: prefersReducedMotion() }));

  useEffect(() => {
    if (import.meta.env.DEV) window.__assembly = store; // debugging aid
    const timer = setTimeout(() => {
      if (store.getMode() === MODE.INTRO) store.skip();
    }, INTRO_WATCHDOG_MS);
    return () => clearTimeout(timer);
  }, [store]);

  return <AssemblyContext.Provider value={store}>{children}</AssemblyContext.Provider>;
}
