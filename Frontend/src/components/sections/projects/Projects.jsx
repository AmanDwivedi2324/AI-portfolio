import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Assemble from "../../agents/Assemble";
import Section from "../../ui/Section";
import SectionHeading from "../../ui/SectionHeading";
import ProjectCard from "./ProjectCard";
import { cn } from "../../../utils/cn";

const ALL = "All";

export default function Projects({ projects, heading }) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => [ALL, ...new Set(projects.map((p) => p.category))], [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (!q) return true;
      return [p.title, p.client, p.category, p.summary, ...p.techStack].join(" ").toLowerCase().includes(q);
    });
  }, [projects, category, query]);

  return (
    <Section id="work">
      <SectionHeading id="work" {...heading}>
        <Assemble id="work.count" variant="fade" className="font-mono text-xs tracking-[0.15em] text-mute uppercase">
          {String(projects.length).padStart(2, "0")} projects shipped
        </Assemble>
      </SectionHeading>

      <Assemble
        id="work.filters"
        variant="fade"
        className="mt-12 flex flex-col gap-4 border-b border-line md:flex-row md:items-end md:justify-between"
      >
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "border-b-2 px-4 py-3 text-sm whitespace-nowrap transition-colors",
                category === c ? "border-blaze text-fg" : "border-transparent text-mute hover:text-fg",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="mb-3 flex items-center gap-2 rounded-md border border-line bg-ink-2 px-3 py-2 md:w-72">
          <Search size={15} className="text-dim" />
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or stack"
            className="w-full bg-transparent text-sm text-fg placeholder:text-dim focus:outline-none"
          />
        </label>
      </Assemble>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            number={String(projects.indexOf(project) + 1).padStart(2, "0")}
          />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="mt-10 font-mono text-sm text-mute">No project matches “{query}”. Try another keyword.</p>
      )}
    </Section>
  );
}
