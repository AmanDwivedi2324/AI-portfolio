import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const Education = () => {
  return (
    <section className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <SectionHeading
          number="05"
          eyebrow="Education"
          title="The foundation."
        />

        <div className="grid gap-4 md:grid-cols-2">

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-7"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
              2022 — 2026
            </p>

            <h3 className="mt-10 text-2xl font-medium text-white">
              B.Tech — Computer Science
            </h3>

            <p className="mt-2 text-sm text-violet-400">
              Artificial Intelligence & Machine Learning
            </p>

            <p className="mt-5 text-sm leading-6 text-zinc-600">
              Ambalika Institute of Management & Technology
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-7"
          >
            <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
              Certifications
            </p>

            <div className="mt-10 space-y-5">
              <div>
                <p className="text-sm text-zinc-300">
                  Introduction to Machine Learning
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  NPTEL — IIT Madras
                </p>
              </div>

              <div>
                <p className="text-sm text-zinc-300">
                  Data Analytics with Python
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  NPTEL — IIT Roorkee
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Education;