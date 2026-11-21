import { ArrowUp } from "lucide-react";
import { SOCIAL_ICONS } from "../../constants/techIcons";
import { SWARM } from "../../constants/site";

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line px-5 pt-16 pb-28 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p
          className="text-outline pointer-events-none font-display text-[clamp(3rem,14.5vw,13.5rem)] leading-[0.85] tracking-tight whitespace-nowrap uppercase select-none"
          aria-hidden="true"
        >
          {profile.firstName} {profile.lastName}
        </p>
        <div className="mt-10 flex flex-col gap-6 text-sm text-dim md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {profile.firstName} {profile.lastName}. Built by one human and {SWARM.agentsDesktop} agents.
          </p>
          <div className="flex items-center gap-5">
            {profile.socials.map(({ _id, platform, label, url }) => {
              const Icon = SOCIAL_ICONS[platform];
              return (
                <a key={_id} href={url} target="_blank" rel="noreferrer" aria-label={label} className="text-mute transition-colors hover:text-fg">
                  {Icon ? <Icon size={18} /> : label}
                </a>
              );
            })}
            <a href="#top" className="flex items-center gap-1.5 text-mute transition-colors hover:text-fg">
              Back to top <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
