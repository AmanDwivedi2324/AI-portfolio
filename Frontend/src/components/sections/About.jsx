import { GraduationCap } from "lucide-react";
import Assemble from "../agents/Assemble";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import SmartImage from "../ui/SmartImage";

const SKILL_GROUP_ORDER = [
  "Generative AI",
  "Agentic AI",
  "Machine Learning",
  "Engineering",
  "Data",
  "GTM Automation",
  "Programming",
  "Tools",
];

const CardTitle = ({ children }) => (
  <h3 className="mb-6 font-mono text-[11px] tracking-[0.18em] text-blaze uppercase">{children}</h3>
);

function groupSkills(skills) {
  const groups = new Map();
  skills.forEach((skill) => {
    if (!groups.has(skill.category)) groups.set(skill.category, []);
    groups.get(skill.category).push(skill.name);
  });
  const rank = (name) => {
    const i = SKILL_GROUP_ORDER.indexOf(name);
    return i === -1 ? SKILL_GROUP_ORDER.length : i;
  };
  return [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b));
}

export default function About({ profile, heading, education, skills, process, quote }) {
  const skillGroups = groupSkills(skills);

  return (
    <Section id="about">
      <SectionHeading id="about" {...heading}>
        <Assemble id="about.bio" as="p" className="max-w-md text-[15px] leading-relaxed text-mute lg:pb-2">
          {profile.bio}
        </Assemble>
      </SectionHeading>

      <div className="mt-16 grid gap-6 lg:grid-cols-12">
        {/* Education + skills */}
        <div className="flex flex-col gap-6 lg:col-span-4">
          <div className="rounded-xl border border-line bg-ink-2 p-6">
            <CardTitle>Education</CardTitle>
            {education.map((item) => (
              <Assemble key={item._id} id={`about.edu.${item._id}`} className="flex gap-4">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blaze/10 text-blaze">
                  <GraduationCap size={18} />
                </span>
                <div>
                  <p className="font-semibold">{item.degree}</p>
                  <p className="mt-1 text-sm text-mute">{item.institution}</p>
                  <p className="mt-2 font-mono text-[11px] text-dim">
                    {item.startDate} – {item.endDate} · <span className="text-blaze">{item.score}</span>
                  </p>
                </div>
              </Assemble>
            ))}
          </div>

          <div className="flex-1 rounded-xl border border-line bg-ink-2 p-6">
            <CardTitle>Skills &amp; tools</CardTitle>
            <div className="flex flex-col gap-5">
              {skillGroups.map(([group, names]) => (
                <Assemble key={group} id={`about.skills.${group}`} variant="fade">
                  <p className="mb-2 text-xs font-semibold text-fg">{group}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {names.map((name) => (
                      <li key={name} className="rounded border border-line px-2 py-0.5 font-mono text-[10px] text-mute">
                        {name}
                      </li>
                    ))}
                  </ul>
                </Assemble>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="rounded-xl border border-line bg-ink-2 p-6 lg:col-span-4 lg:self-start">
          <CardTitle>How I build an agent</CardTitle>
          <ol className="relative flex flex-col gap-7 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-line-strong">
            {process.map((step, i) => (
              <li key={step._id}>
                <Assemble id={`about.step.${i + 1}`} className="flex gap-4">
                  <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blaze/50 bg-ink font-display text-sm text-blaze">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <p className="font-display text-lg leading-tight tracking-wide uppercase">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.description}</p>
                  </div>
                </Assemble>
              </li>
            ))}
          </ol>
        </div>

        {/* Quote card with the road photo */}
        <Assemble
          id="about.quote"
          variant="scale"
          className="relative h-[520px] overflow-hidden rounded-xl border border-line lg:sticky lg:top-24 lg:col-span-4 lg:h-[min(640px,calc(100svh-8rem))] lg:self-start"
        >
          <SmartImage
            src={profile.secondaryPhotoUrl}
            alt={`${profile.firstName} on an open road`}
            loading="lazy"
            wrapperClassName="absolute inset-0"
            className="h-full w-full object-cover object-[50%_75%] grayscale contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-blaze mix-blend-multiply opacity-60" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden="true" />
          <figure className="relative flex h-full flex-col justify-end p-7">
            <span className="font-display text-7xl leading-none text-white/90" aria-hidden="true">
              &ldquo;
            </span>
            <blockquote className="font-serif text-3xl leading-tight text-white italic">{quote.text}</blockquote>
            <figcaption className="mt-5 font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase">
              — {quote.author}, note to self
            </figcaption>
          </figure>
        </Assemble>
      </div>
    </Section>
  );
}
