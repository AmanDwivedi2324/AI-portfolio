/**
 * Mini "running workflow" visual for a project card: the project's pipeline
 * steps as nodes, lit up one after another like an agent graph executing.
 */
const STEP_SECONDS = 0.75;

export default function PipelinePreview({ slug, steps }) {
  const n = steps.length;
  const points = steps.map((_, i) => ({
    x: n === 1 ? 50 : 14 + (i * 72) / (n - 1),
    y: i % 2 === 0 ? 42 : 66,
  }));
  const cycle = `${n * STEP_SECONDS}s`;

  return (
    <div className="dot-grid relative aspect-[16/10] overflow-hidden border-b border-line bg-ink">
      <div className="flex items-center justify-between border-b border-line bg-ink-2/80 px-3 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[10px] text-dim">{slug}.graph</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> running
        </span>
      </div>

      <div className="absolute inset-x-0 top-8 bottom-0">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {points.slice(1).map((p, i) => (
            <line
              key={i}
              x1={points[i].x}
              y1={points[i].y}
              x2={p.x}
              y2={p.y}
              className="flow-line"
              stroke="rgb(255 255 255 / 0.28)"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <ol className="sr-only">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {steps.map((step, i) => (
          <span
            key={step}
            aria-hidden="true"
            className="pipe-node absolute -translate-x-1/2 -translate-y-1/2 rounded-md border bg-ink-2 px-2 py-1 font-mono text-[10px] whitespace-nowrap"
            style={{
              left: `${points[i].x}%`,
              top: `${points[i].y}%`,
              "--cycle": cycle,
              "--delay": `${i * STEP_SECONDS}s`,
            }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
