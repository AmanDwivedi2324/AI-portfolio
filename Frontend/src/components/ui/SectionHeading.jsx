import Assemble from "../agents/Assemble";

/**
 * "01 / Selected work" label + big condensed title. `accent` renders in red.
 * `id` namespaces the assembly targets (e.g. "work" → work.label, work.title).
 */
export default function SectionHeading({ id, index, label, title, accent, children }) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <Assemble id={`${id}.label`} variant="fade" className="mb-5 flex items-center gap-3 font-mono text-xs tracking-[0.18em] uppercase">
          <span className="text-blaze">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="text-mute">{label}</span>
        </Assemble>
        <Assemble
          id={`${id}.title`}
          as="h2"
          variant="type"
          className="font-display text-5xl leading-[0.95] tracking-tight uppercase sm:text-6xl lg:text-7xl"
        >
          {title} {accent && <span className="text-blaze">{accent}</span>}
        </Assemble>
      </div>
      {children}
    </div>
  );
}
