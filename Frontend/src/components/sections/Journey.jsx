import { MapPin } from "lucide-react";
import Assemble from "../agents/Assemble";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import RichText from "../ui/RichText";
import { cn } from "../../utils/cn";

export default function Journey({ heading, experience, profile }) {
  const current = experience.find((e) => e.current);

  return (
    <Section id="journey">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <SectionHeading id="journey" {...heading} />
          {current && (
            <Assemble id="journey.now" className="mt-10 rounded-xl border border-line bg-ink-2 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-mute uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Currently
              </p>
              <p className="mt-3 font-display text-3xl tracking-wide uppercase">{current.role}</p>
              <p className="mt-1 text-mute">
                at <span className="text-fg">{current.company}</span> · since {current.startDate}
              </p>
            </Assemble>
          )}
          <Assemble id="journey.resume" variant="fade" className="mt-6">
            <a
              href={profile.resumeUrl}
              download
              // Uploaded résumés live on Cloudinary (another site): open them in a new tab.
              {...(/^https?:\/\//.test(profile.resumeUrl) && { target: "_blank", rel: "noreferrer" })}
              className="font-mono text-xs tracking-[0.15em] text-blaze uppercase hover:text-ember"
            >
              Download full résumé →
            </a>
          </Assemble>
        </div>

        <ol className="relative ml-1.5 border-l border-line lg:col-span-7">
          {experience.map((role) => (
            <li key={role._id} className="relative pb-14 pl-8 last:pb-0 md:pl-12">
              <span
                className={cn(
                  "absolute top-2 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-ink",
                  role.current ? "pulse-ring bg-blaze" : "bg-line-strong",
                )}
                aria-hidden="true"
              />
              <Assemble id={`journey.role.${role._id}`}>
                <p className="font-mono text-[11px] tracking-[0.15em] text-blaze uppercase">
                  {role.startDate} — {role.current ? "Present" : role.endDate}
                </p>
                <h3 className="mt-2 font-display text-4xl tracking-wide uppercase md:text-5xl">{role.company}</h3>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
                  <span className="font-semibold text-fg">{role.role}</span>
                  <span className="flex items-center gap-1 text-dim">
                    <MapPin size={12} /> {role.location}
                  </span>
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {role.highlights.map((line, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-mute">
                      <span className="mt-2.5 h-px w-3 shrink-0 bg-blaze" aria-hidden="true" />
                      <span>
                        <RichText text={line} strongClassName="font-semibold text-blaze" />
                      </span>
                    </li>
                  ))}
                </ul>
              </Assemble>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
