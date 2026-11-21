import { ArrowUpRight, FileText } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Assemble from "../../agents/Assemble";
import PipelinePreview from "./PipelinePreview";
import SmartImage from "../../ui/SmartImage";

const LINKS = [
  { key: "live", label: "Live", Icon: ArrowUpRight },
  { key: "github", label: "Code", Icon: SiGithub },
  { key: "docs", label: "Architecture", Icon: FileText },
];

export default function ProjectCard({ project, number }) {
  const primaryUrl = project.links.live || project.links.github || project.links.docs;
  const links = LINKS.filter(({ key }) => project.links[key]);

  return (
    <Assemble
      id={`work.project.${project.slug}`}
      as="article"
      variant="scale"
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-ink-2 hover:border-blaze/50"
    >
      {project.imageUrl ? (
        <SmartImage
          src={project.imageUrl}
          alt={`${project.title} screenshot`}
          loading="lazy"
          wrapperClassName="aspect-[16/10] overflow-hidden border-b border-line"
          className="h-full w-full object-cover group-hover:scale-[1.03]"
        />
      ) : (
        <PipelinePreview slug={project.slug} steps={project.pipeline} />
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start gap-4">
          <span className="font-display text-5xl leading-none text-ember">{number}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl leading-tight tracking-wide uppercase">{project.title}</h3>
            <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-dim uppercase">
              {project.category} / {project.client}
            </p>
          </div>
          {primaryUrl && (
            <a
              href={primaryUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${project.title}`}
              className="rounded-full border border-line p-2 text-mute transition-colors hover:border-blaze hover:text-fg"
            >
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>

        <p className="text-sm leading-relaxed text-mute">{project.summary}</p>

        <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.techStack.map((tech) => (
            <li key={tech} className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-mute">
              {tech}
            </li>
          ))}
        </ul>

        {links.length > 0 && (
          <div className="mt-auto flex gap-4 border-t border-line pt-4">
            {links.map((link) => {
              const { key, label, Icon } = link;
              return (
                <a
                  key={key}
                  href={project.links[key]}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-medium text-mute transition-colors hover:text-fg"
                >
                  <Icon size={13} /> {label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </Assemble>
  );
}
