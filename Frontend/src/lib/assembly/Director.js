import { MODE } from "./createAssemblyStore";
import { clamp, rand, sleep } from "../../utils/random";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Director — moves the agent cursors and drives the assembly store.
 *
 * Each agent runs its own async loop: claim the next visible pending
 * element → fly to it → "build" it (selection frame) → reveal it. With
 * nothing left on screen, agents wander or inspect finished elements, and
 * wake up again as soon as the user scrolls.
 *
 * Cursors are moved with the Web Animations API on their DOM nodes, so the
 * swarm never causes React re-renders.
 */
export class Director {
  /**
   * @param {ReturnType<import('./createAssemblyStore').createAssemblyStore>} store
   * @param {{ name: string, el: HTMLElement }[]} agents
   * @param {typeof import('../../constants/site').SWARM} config
   */
  constructor(store, agents, config) {
    this.store = store;
    this.config = config;
    this.agents = agents.map((a) => ({ ...a, x: 0, y: 0, anim: null }));
    this.runId = 0;
    this.inspectors = 0;
    this.timers = [];
    this.resetWake();
  }

  // ── lifecycle ───────────────────────────────────────────────
  start() {
    this.stop();
    const runId = ++this.runId;
    this.placeInRing();

    if (this.store.getMode() === MODE.INTRO) {
      this.timers.push(setTimeout(() => this.store.startBuilding(), this.config.introMs));
    }
    this.timers.push(setInterval(() => this.store.sweep(this.config.failsafeMs), 400));

    this.agents.forEach((agent, i) => {
      this.loop(agent, i, runId).catch((error) => {
        // Never leave the page invisible because of an animation bug.
        console.error("[agents] loop failed, revealing page", error);
        this.store.skip();
      });
    });
  }

  stop() {
    this.runId += 1;
    this.timers.forEach((t) => clearTimeout(t)); // clears intervals too
    this.timers = [];
    this.agents.forEach((a) => {
      a.anim?.cancel();
      a.anim = null;
      a.el.classList.remove("is-active");
    });
    this.wake();
  }

  /** Called on scroll/resize so idle agents pick up new work immediately. */
  wake() {
    const resolve = this.wakeResolve;
    this.resetWake();
    resolve?.();
  }

  resetWake() {
    this.wakePromise = new Promise((resolve) => {
      this.wakeResolve = resolve;
    });
  }

  // ── agent behaviour ─────────────────────────────────────────
  async loop(agent, index, runId) {
    await sleep(index * 50);
    const alive = () => this.runId === runId;

    while (alive()) {
      const mode = this.store.getMode();
      if (mode === MODE.SKIPPED) return;

      if (mode === MODE.INTRO) {
        await this.orbit(agent, index);
        continue;
      }

      const job = this.store.claim(agent.name);
      if (job) {
        await this.build(agent, job, alive);
        continue;
      }

      if (this.inspectors < this.config.maxInspectors && Math.random() < 0.22) {
        await this.inspect(agent, alive);
      } else {
        await this.wander(agent);
      }
    }
  }

  async build(agent, job, alive) {
    const point = this.pointIn(job.rect);
    const ok = await this.move(agent, point.x, point.y);
    if (!alive() || !ok) {
      this.store.release(job.id);
      return;
    }
    if (!this.store.isClaimedBy(job.id, agent.name)) return;

    agent.el.classList.add("is-active");
    this.store.markBuilding(job.id, agent.name);

    // Small "editing" moves inside the element while it is being built.
    const total = rand(...this.config.buildMs);
    const rect = this.store.getRect(job.id) ?? job.rect;
    const nudge = this.pointIn(rect);
    await this.move(agent, nudge.x, nudge.y, total / 1000);

    agent.el.classList.remove("is-active");
    if (alive()) this.store.markDone(job.id);
  }

  async inspect(agent, alive) {
    const target = this.store.pickInspectable();
    if (!target) return this.wander(agent);
    this.inspectors += 1;
    try {
      const point = this.pointIn(target.rect);
      const ok = await this.move(agent, point.x, point.y);
      if (!ok || !alive()) return;
      this.store.setInspect(target.id, agent.name);
      await Promise.race([sleep(rand(700, 1100)), this.wakePromise]);
      this.store.setInspect(target.id, null);
    } finally {
      this.inspectors -= 1;
    }
  }

  async wander(agent) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = rand(0.04, 0.96) * w;
    const y = rand(0.14, 0.86) * h;
    const moving = this.move(agent, x, y, rand(1.4, 2.6));
    const woke = await Promise.race([moving.then(() => false), this.wakePromise.then(() => true)]);
    if (woke) {
      this.freeze(agent);
      return;
    }
    await Promise.race([sleep(rand(300, 900)), this.wakePromise]);
  }

  async orbit(agent, index) {
    const { cx, cy } = this.center();
    const n = this.agents.length;
    agent.angle = (agent.angle ?? (index / n) * Math.PI * 2) + rand(0.5, 0.9);
    const r = agent.radius;
    await this.move(agent, cx + Math.cos(agent.angle) * r, cy + Math.sin(agent.angle) * r, 0.55);
  }

  // ── movement primitives ─────────────────────────────────────
  /** Animate an agent to (x, y). Resolves false if interrupted. */
  async move(agent, x, y, seconds) {
    const dist = Math.hypot(x - agent.x, y - agent.y);
    const [min, max] = this.config.flightSeconds;
    const duration = (seconds ?? clamp(dist * this.config.flightSpeed + min, min, max)) * 1000;
    const from = `translate3d(${agent.x}px, ${agent.y}px, 0)`;
    const to = `translate3d(${x}px, ${y}px, 0)`;

    agent.anim?.cancel();
    const anim = agent.el.animate([{ transform: from }, { transform: to }], {
      duration,
      easing: EASE,
      fill: "forwards",
    });
    agent.anim = anim;
    // `finished` only settles when the browser renders a frame, which never
    // happens in a background tab — so a timer can also complete the move.
    const outcome = await Promise.race([
      anim.finished.then(
        () => "done",
        () => "cancelled",
      ),
      sleep(duration + 80).then(() => "done"),
    ]);
    if (outcome === "cancelled" || agent.anim !== anim) return false;
    agent.x = x;
    agent.y = y;
    agent.el.style.transform = to;
    anim.cancel();
    agent.anim = null;
    return true;
  }

  /** Stop an agent where it is right now (mid-flight). */
  freeze(agent) {
    if (!agent.anim) return;
    const matrix = new DOMMatrixReadOnly(getComputedStyle(agent.el).transform);
    agent.x = matrix.m41;
    agent.y = matrix.m42;
    agent.el.style.transform = `translate3d(${agent.x}px, ${agent.y}px, 0)`;
    const anim = agent.anim;
    agent.anim = null;
    anim.cancel();
  }

  placeInRing() {
    const { cx, cy } = this.center();
    const n = this.agents.length;
    this.agents.forEach((agent, i) => {
      agent.angle = (i / n) * Math.PI * 2;
      agent.radius = rand(46, 92);
      agent.x = cx + Math.cos(agent.angle) * agent.radius;
      agent.y = cy + Math.sin(agent.angle) * agent.radius;
      agent.el.style.transform = `translate3d(${agent.x}px, ${agent.y}px, 0)`;
    });
  }

  center() {
    return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
  }

  /** A natural-looking point inside a rect, kept on screen. */
  pointIn(rect) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const left = Math.max(rect.left, 8);
    const right = Math.min(rect.right, w - 24);
    const top = Math.max(rect.top, 8);
    const bottom = Math.min(rect.bottom, h - 28);
    const spanX = Math.max(right - left, 1);
    const spanY = Math.max(bottom - top, 1);
    return {
      x: left + spanX * rand(0.06, Math.min(0.7, 0.06 + 420 / spanX)),
      y: top + spanY * rand(0.25, 0.8),
    };
  }
}
