import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const AICTA = ({ onOpenChat }) => {
  return (
    <section className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#09090b] px-6 py-16 text-center sm:px-10 sm:py-24"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[100px]" />

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400">
              <Sparkles size={20} />
            </div>

            <p className="mt-7 text-xs uppercase tracking-[0.2em] text-violet-400">
              AI Portfolio Assistant
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Want to know more about my work?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-600">
              Ask my AI assistant about my projects, AI/ML experience,
              technical skills, or the systems I've built.
            </p>

            <button
              onClick={onOpenChat}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              Talk to Aman AI

              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AICTA;