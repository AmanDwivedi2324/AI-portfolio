import { motion } from "framer-motion";
import {
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

        {/* Background glow */}
        <div className="pointer-events-none absolute left-[30%] top-[15%] h-[450px] w-[450px] rounded-full bg-violet-600/[0.07] blur-[140px]" />

        <div className="relative">

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open to AI/ML opportunities
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl text-[clamp(3.5rem,10vw,9rem)] font-semibold leading-[0.85] tracking-[-0.065em]"
          >
            AI / ML
            <br />

            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent">
              ENGINEER
            </span>
          </motion.h1>

          {/* Main description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto]"
          >
            <div>
              <p className="max-w-2xl text-xl leading-relaxed text-zinc-400 sm:text-2xl">
                {portfolio.tagline}
              </p>

              <div className="mt-6 flex max-w-2xl flex-wrap gap-2">
                {portfolio.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-xs text-zinc-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="flex items-end gap-2 lg:pb-1">
              <a
                href={portfolio.social.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 p-3 text-zinc-500 transition hover:border-white/20 hover:text-white"
              >
                <Github size={18} />
              </a>

              <a
                href={portfolio.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 p-3 text-zinc-500 transition hover:border-white/20 hover:text-white"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={scrollToWork}
              className="group flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              Explore AI work

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={onOpenChat}
              className="group flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-white transition hover:border-violet-400/40 hover:bg-violet-500/10"
            >
              <Sparkles
                size={16}
                className="text-violet-400"
              />

              Ask Aman AI
            </button>
          </motion.div>

          {/* Bottom metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-24 grid max-w-3xl grid-cols-2 gap-8 border-t border-white/10 pt-6 sm:grid-cols-4"
          >
            <div>
              <p className="text-xs text-zinc-600">FOCUS</p>
              <p className="mt-2 text-sm text-zinc-300">
                AI / ML
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-600">SPECIALTY</p>
              <p className="mt-2 text-sm text-zinc-300">
                Generative AI
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-600">BUILD</p>
              <p className="mt-2 text-sm text-zinc-300">
                Production AI
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-600">BASE</p>
              <p className="mt-2 text-sm text-zinc-300">
                India
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;