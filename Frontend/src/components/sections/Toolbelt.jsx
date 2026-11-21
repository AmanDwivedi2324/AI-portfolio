import Assemble from "../agents/Assemble";
import TechIcon from "../ui/TechIcon";

/** Scrolling strip of the main tools (skills flagged `featured`). */
export default function Toolbelt({ skills }) {
  const tools = skills.filter((s) => s.featured);
  const loop = [...tools, ...tools];

  return (
    <section className="px-5 py-10 sm:px-8 md:py-14" aria-label="Tools">
      <Assemble id="tools.strip" variant="fade" className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:gap-10">
        <p className="shrink-0 font-mono text-[11px] leading-relaxed tracking-[0.18em] text-mute uppercase">
          Built with
          <br />
          <span className="text-fg">the tools I trust</span>
        </p>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <ul className="marquee flex w-max gap-3 py-2">
            {loop.map((tool, i) => (
              <li
                key={`${tool._id}-${i}`}
                aria-hidden={i >= tools.length}
                className="group relative flex h-16 w-16 items-center justify-center rounded-xl border border-line bg-ink-2 text-dim transition-colors hover:border-line-strong"
              >
                <TechIcon icon={tool.icon} name={tool.name} size={26} className="transition-colors group-hover:text-(--brand)" />
                <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full rounded bg-fg px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  {tool.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Assemble>
    </section>
  );
}
