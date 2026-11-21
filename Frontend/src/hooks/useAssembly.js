import { useCallback, useContext, useSyncExternalStore } from "react";
import { AssemblyContext } from "../contexts/assemblyContext";

export function useAssemblyStore() {
  const store = useContext(AssemblyContext);
  if (!store) throw new Error("useAssemblyStore must be used inside <AssemblyProvider>");
  return store;
}

/** Page-level progress: { mode, done, total, busy }. */
export function useAssemblySummary() {
  const store = useAssemblyStore();
  return useSyncExternalStore(store.subscribe, store.getSummary);
}

/** State of one target: { state, agent, inspect }. */
export function useAssemblyTarget(id) {
  const store = useAssemblyStore();
  const subscribe = useCallback((listener) => store.subscribeTarget(id, listener), [store, id]);
  const getSnapshot = useCallback(() => store.getTargetSnapshot(id), [store, id]);
  return useSyncExternalStore(subscribe, getSnapshot);
}
