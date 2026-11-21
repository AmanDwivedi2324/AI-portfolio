/**
 * Assembly store — framework-agnostic state for the "agents build the page"
 * effect. React reads it through useSyncExternalStore (see hooks/useAssembly).
 *
 * Every <Assemble> element registers as a *target*:
 *   pending  → invisible, waiting for an agent
 *   building → an agent is on it (selection frame shown)
 *   done     → revealed
 *
 * Page modes:
 *   intro    → agents gather around the logo
 *   building → agents claim visible pending targets (top-to-bottom)
 *   complete → every target is done
 *   skipped  → user skipped (or prefers reduced motion): everything shown
 */
export const MODE = Object.freeze({
  INTRO: "intro",
  BUILDING: "building",
  COMPLETE: "complete",
  SKIPPED: "skipped",
});

const PENDING = Object.freeze({ state: "pending", agent: null, inspect: null });
const DONE = Object.freeze({ state: "done", agent: null, inspect: null });

const isVisible = (rect, viewportHeight) =>
  rect.bottom > 0 && rect.top < viewportHeight * 0.94;

export function createAssemblyStore({ startSkipped = false } = {}) {
  /** @type {Map<string, {id, label, state, el, claimedBy, agent, inspectBy, seenAt}>} */
  const targets = new Map();
  const snapshots = new Map();
  const targetListeners = new Map();
  const listeners = new Set();

  let mode = startSkipped ? MODE.SKIPPED : MODE.INTRO;
  let summary = { mode, done: 0, total: 0, busy: false };

  // ── notification ────────────────────────────────────────────
  const emit = () => {
    let done = 0;
    let busy = false;
    for (const t of targets.values()) {
      if (t.state === "done") done += 1;
      if (t.claimedBy) busy = true;
    }
    summary = { mode, done, total: targets.size, busy };
    listeners.forEach((listener) => listener());
  };

  const emitTarget = (id) => {
    const t = targets.get(id);
    let snap = PENDING;
    if (t) {
      if (t.state === "done" && !t.inspectBy) snap = DONE;
      else if (t.state === "pending") snap = PENDING;
      else snap = { state: t.state, agent: t.agent, inspect: t.inspectBy };
    }
    snapshots.set(id, snap);
    targetListeners.get(id)?.forEach((listener) => listener());
  };

  const settledMode = () => mode === MODE.SKIPPED || mode === MODE.COMPLETE;

  const maybeComplete = () => {
    if (mode !== MODE.BUILDING) return;
    for (const t of targets.values()) if (t.state !== "done") return;
    if (targets.size > 0) mode = MODE.COMPLETE;
  };

  const setState = (t, state, agent = null) => {
    t.state = state;
    t.agent = agent;
    if (state !== "building") t.claimedBy = null;
    maybeComplete();
    emitTarget(t.id);
    emit();
  };

  // ── registration (called by <Assemble>) ─────────────────────
  const attach = (id, el, label) => {
    let t = targets.get(id);
    if (!t) {
      t = {
        id,
        label,
        state: settledMode() ? "done" : "pending",
        el: null,
        claimedBy: null,
        agent: null,
        inspectBy: null,
        seenAt: null,
      };
      targets.set(id, t);
      emitTarget(id);
      emit();
    }
    t.el = el;
    t.label = label;
  };

  const detach = (id) => {
    const t = targets.get(id);
    if (!t) return;
    t.el = null;
    // StrictMode unmounts and remounts synchronously; only settle the target
    // if it is still detached on the next tick (e.g. filtered out of a list).
    setTimeout(() => {
      if (!t.el && t.state !== "done") setState(t, "done");
    }, 0);
  };

  // ── director API ────────────────────────────────────────────
  /** Claim the next visible pending target in reading order. */
  const claim = (agentName) => {
    if (mode !== MODE.BUILDING) return null;
    const vh = window.innerHeight;
    let best = null;
    let bestRect = null;
    let bestKey = Infinity;
    for (const t of targets.values()) {
      if (t.state !== "pending" || t.claimedBy || !t.el) continue;
      const rect = t.el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        // Hidden at this breakpoint (display:none) — nothing to animate.
        setState(t, "done");
        continue;
      }
      if (!isVisible(rect, vh)) continue;
      const key = Math.round(rect.top / 56) * 100000 + rect.left;
      if (key < bestKey) {
        best = t;
        bestRect = rect;
        bestKey = key;
      }
    }
    if (!best) return null;
    best.claimedBy = agentName;
    emit();
    return { id: best.id, rect: bestRect };
  };

  const getRect = (id) => targets.get(id)?.el?.getBoundingClientRect() ?? null;

  const isClaimedBy = (id, agentName) => {
    const t = targets.get(id);
    return Boolean(t && t.state === "pending" && t.claimedBy === agentName);
  };

  const release = (id) => {
    const t = targets.get(id);
    if (t && t.state === "pending") {
      t.claimedBy = null;
      emit();
    }
  };

  const markBuilding = (id, agentName) => {
    const t = targets.get(id);
    if (t) setState(t, "building", agentName);
  };

  const markDone = (id) => {
    const t = targets.get(id);
    if (t && t.state !== "done") setState(t, "done");
  };

  /** Pick a random finished target on screen for an idle agent to inspect. */
  const pickInspectable = () => {
    const vh = window.innerHeight;
    const pool = [];
    for (const t of targets.values()) {
      if (t.state !== "done" || t.inspectBy || !t.el) continue;
      const rect = t.el.getBoundingClientRect();
      if (rect.width > 0 && rect.top > 70 && rect.bottom < vh - 80) pool.push({ id: t.id, rect });
    }
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  };

  const setInspect = (id, agentName) => {
    const t = targets.get(id);
    if (!t) return;
    t.inspectBy = agentName;
    t.agent = agentName;
    emitTarget(id);
  };

  /** Reveal anything that has been visible but unclaimed for too long. */
  const sweep = (failsafeMs) => {
    if (mode !== MODE.BUILDING) return;
    const now = performance.now();
    const vh = window.innerHeight;
    for (const t of targets.values()) {
      if (t.state !== "pending" || t.claimedBy || !t.el) continue;
      const rect = t.el.getBoundingClientRect();
      if (!isVisible(rect, vh)) {
        t.seenAt = null;
        continue;
      }
      t.seenAt ??= now;
      if (now - t.seenAt > failsafeMs) setState(t, "done");
    }
  };

  // ── page-level controls ─────────────────────────────────────
  const startBuilding = () => {
    if (mode !== MODE.INTRO) return;
    mode = MODE.BUILDING;
    maybeComplete();
    emit();
  };

  const skip = () => {
    mode = MODE.SKIPPED;
    for (const t of targets.values()) {
      Object.assign(t, { state: "done", claimedBy: null, agent: null, inspectBy: null, seenAt: null });
      emitTarget(t.id);
    }
    emit();
  };

  const replay = () => {
    mode = MODE.INTRO;
    for (const t of targets.values()) {
      Object.assign(t, { state: "pending", claimedBy: null, agent: null, inspectBy: null, seenAt: null });
      emitTarget(t.id);
    }
    emit();
  };

  // ── subscriptions ───────────────────────────────────────────
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const subscribeTarget = (id, listener) => {
    if (!targetListeners.has(id)) targetListeners.set(id, new Set());
    targetListeners.get(id).add(listener);
    return () => targetListeners.get(id)?.delete(listener);
  };

  const getSummary = () => summary;
  const getMode = () => mode;
  const getTargetSnapshot = (id) => snapshots.get(id) ?? (settledMode() ? DONE : PENDING);

  return {
    attach,
    detach,
    claim,
    getRect,
    isClaimedBy,
    release,
    markBuilding,
    markDone,
    pickInspectable,
    setInspect,
    sweep,
    startBuilding,
    skip,
    replay,
    subscribe,
    subscribeTarget,
    getSummary,
    getMode,
    getTargetSnapshot,
  };
}
