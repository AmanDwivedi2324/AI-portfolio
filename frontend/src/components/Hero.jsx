import { motion } from "framer-motion";

import {
  ArrowDownRight,
  ArrowRight,
  Github,
  Linkedin,
  Sparkles,
} from "lucide-react";

import { portfolio } from "../data/portfolio";

const Hero = ({ onOpenChat }) => {
  const scrollToWork = () => {
    document.querySelector("#work")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-5xl">

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            Available for opportunities
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-5xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-white"
          >
            AI / ML
            <br />

            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              ENGINEER
            </span>
          </motion.h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-zinc-400 sm:text-xl">
                {portfolio.tagline}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {portfolio.skills.slice(0, 6).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-2">
              <a
                href={portfolio.social.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 p-3 text-zinc-400 transition hover:border-white/20 hover:text-white"
              >
                <Github size={18} />
              </a>

              <a
                href={portfolio.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 p-3 text-zinc-400 transition hover:border-white/20 hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={scrollToWork}
              className="group flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
            >
              Explore my work
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={onOpenChat}
              className="group flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition hover:border-violet-400/40 hover:bg-violet-500/10"
            >
              <Sparkles
                size={17}
                className="text-violet-400"
              />
              Talk to my AI
            </button>
          </motion.div>
        </div>

        {/* Bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-5 hidden items-center gap-3 text-xs text-zinc-600 sm:flex lg:left-10"
        >
          <ArrowDownRight size={16} />
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;