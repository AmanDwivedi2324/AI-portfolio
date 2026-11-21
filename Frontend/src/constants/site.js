/** Navigation entries. `id` must match a <Section id>. */
export const NAV_LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

/** Agent swarm tuning. */
export const SWARM = {
  agentsDesktop: 16,
  agentsMobile: 6,
  mobileBreakpoint: 768,
  introMs: 1400,
  /** How long an agent "works" on a target before it is revealed. */
  buildMs: [420, 720],
  /** Seconds per pixel of travel, clamped to flightSeconds. */
  flightSpeed: 1 / 1500,
  flightSeconds: [0.38, 1.05],
  /** A visible target left unclaimed this long is revealed anyway. */
  failsafeMs: 3200,
  /** Max agents "inspecting" finished elements at once once idle. */
  maxInspectors: 2,
};
