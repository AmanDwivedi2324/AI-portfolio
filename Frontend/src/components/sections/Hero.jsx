import { ArrowDown, ArrowRight, Download, MapPin, Play } from "lucide-react";
import Assemble from "../agents/Assemble";
import Button from "../ui/Button";
import SmartImage from "../ui/SmartImage";
import { useAssemblyStore } from "../../hooks/useAssembly";

function Portrait({ src, name }) {
  return (
    <Assemble
      id="hero.portrait"
      variant="scale"
      className="relative mx-auto aspect-[540/689] h-[54svh] max-h-[560px] lg:absolute lg:bottom-0 lg:left-1/2 lg:h-[86svh] lg:max-h-[900px] lg:-translate-x-1/2"
    >
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_52%,transparent_88%)]">
        <SmartImage
          src={src}
          alt={`Portrait of ${name}`}
          width={1080}
          height={1378}
          fetchPriority="high"
          wrapperClassName="h-full w-full"
          // Head-and-shoulders shaped placeholder while the photo loads
          placeholderClassName="inset-x-[14%] top-[6%] bottom-0 rounded-t-[48%] bg-white/[0.04]"
          className="h-full w-full object-contain object-bottom [filter:contrast(1.06)_saturate(0.88)]"
        />
        {/* Red rim light, masked to the silhouette */}
        <div
          className="absolute inset-0 opacity-70 mix-blend-color"
          style={{
            background: "linear-gradient(100deg, #f2242f 0%, rgba(242,36,47,0.35) 30%, transparent 58%)",
            maskImage: `url(${src})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "bottom",
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "bottom",
          }}
        />
      </div>
    </Assemble>
  );
}

export default function Hero({ profile }) {
  const store = useAssemblyStore();
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const replay = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(store.replay, 350);
  };

  return (
    <section id="top" className="grain relative overflow-hidden">
      {/* Backdrop */}
      <div className="dot-grid absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_42%,rgba(242,36,47,0.22),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Giant surname behind the portrait */}
      <Assemble
        id="hero.backdrop"
        variant="type"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[calc(4rem+5vw)] text-center font-display text-[25vw] leading-[0.8] tracking-[-0.01em] uppercase select-none lg:top-[calc(4rem+8.5svh)] lg:text-[clamp(12rem,23vw,36svh)]"
      >
        <span className="bg-gradient-to-b from-blaze to-blaze-deep bg-clip-text text-transparent">{profile.lastName}</span>
      </Assemble>

      <div className="relative mx-auto max-w-7xl px-5 pt-[calc(4rem+20vw)] pb-28 sm:px-8 lg:min-h-svh lg:pt-0 lg:pb-0">
        <Portrait src={profile.portraitUrl} name={fullName} />

        {/* Eyebrow (top-left on desktop) */}
        <Assemble
          id="hero.eyebrow"
          variant="fade"
          className="mt-8 font-mono text-[11px] tracking-[0.2em] text-blaze uppercase lg:absolute lg:top-[calc(4rem+2svh)] lg:left-8 lg:mt-0"
        >
          {profile.eyebrow}
        </Assemble>

        {/* Intro block (bottom-left on desktop) */}
        <div className="relative z-10 mt-4 lg:absolute lg:bottom-[12svh] lg:left-8 lg:mt-0 lg:max-w-[23rem]">
          <Assemble id="hero.greeting" variant="type" className="font-serif text-4xl text-blaze italic lg:text-[min(3rem,6svh)]">
            {profile.greeting}
          </Assemble>
          <Assemble
            id="hero.name"
            as="h1"
            variant="type"
            className="font-display text-[5.5rem] leading-[0.85] tracking-tight uppercase lg:text-[min(8.5rem,14svh)]"
          >
            {profile.firstName}
            <span className="text-blaze">.</span>
            <span className="sr-only">
              {" "}
              {profile.lastName}, {profile.role}
            </span>
          </Assemble>
          <Assemble id="hero.role" variant="fade" className="mt-4 font-display text-lg tracking-wide text-blaze uppercase lg:text-xl">
            {profile.roleLine}
          </Assemble>
          <Assemble id="hero.tagline" as="p" className="mt-3 text-[15px] leading-relaxed text-mute">
            {profile.tagline}
          </Assemble>
          <Assemble id="hero.cta" className="mt-6 flex flex-wrap gap-3">
            <Button href="#work">
              See the work <ArrowRight size={16} />
            </Button>
            <Button variant="ghost" href={profile.resumeUrl} download>
              Résumé <Download size={15} />
            </Button>
          </Assemble>
          <Assemble id="hero.location" variant="fade" className="mt-5 flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-dim uppercase">
            <MapPin size={13} className="text-blaze" /> {profile.location}
          </Assemble>
        </div>

        {/* Status + stats (right on desktop) */}
        <div className="relative z-10 mt-12 flex flex-col gap-8 lg:absolute lg:top-[calc(4rem+2svh)] lg:right-8 lg:mt-0 lg:items-end lg:text-right">
          <Assemble id="hero.status" variant="fade" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-mute uppercase lg:justify-end">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span>
              <span className="text-fg">{profile.status.label}</span> · {profile.status.text}
            </span>
          </Assemble>
          <div className="grid grid-cols-3 gap-4 lg:mt-[12svh] lg:flex lg:flex-col lg:gap-7">
            {profile.stats.map((stat, i) => (
              <Assemble key={stat._id} id={`hero.stat.${i + 1}`} className="flex flex-col lg:items-end">
                <span className="font-display text-5xl leading-none text-blaze lg:text-[min(4rem,8svh)]">{stat.value}</span>
                <span className="mt-1 max-w-[9rem] font-mono text-[10px] leading-snug tracking-[0.12em] text-mute uppercase">
                  {stat.label}
                </span>
              </Assemble>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="relative z-10 mt-12 flex items-center justify-between lg:absolute lg:inset-x-8 lg:bottom-7 lg:mt-0">
          <Assemble id="hero.replay" variant="fade">
            <button type="button" onClick={replay} className="group flex items-center gap-3 text-left">
              <span className="pulse-ring flex h-10 w-10 items-center justify-center rounded-full border border-blaze/60 text-blaze transition-colors group-hover:bg-blaze group-hover:text-white">
                <Play size={14} fill="currentColor" />
              </span>
              <span className="font-mono text-[10px] leading-snug tracking-[0.15em] text-mute uppercase transition-colors group-hover:text-fg">
                Watch the agents
                <br />
                rebuild this page
              </span>
            </button>
          </Assemble>
          <Assemble id="hero.scroll" variant="fade" className="hidden lg:block">
            <a href="#work" className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-mute uppercase hover:text-fg">
              Selected work <ArrowDown size={13} />
            </a>
          </Assemble>
        </div>
      </div>
    </section>
  );
}
