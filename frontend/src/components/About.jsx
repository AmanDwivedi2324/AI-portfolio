import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const About = () => {
  return (
    <section
      id="about"
      className="px-5 py-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">

        <SectionHeading
          number="02"
          eyebrow="About"
          title="I like turning AI ideas into working systems."
        />

        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xl leading-relaxed text-zinc-300 sm:text-2xl">
              I'm an AI/ML engineer focused on machine learning,
              generative AI, and intelligent applications.
            </p>

            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-500">
              I enjoy working across the complete lifecycle of an
              AI application — understanding the data, building models,
              experimenting with LLMs and retrieval systems, exposing
              them through APIs, and turning them into usable products.
            </p>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-500">
              My software engineering background gives me the ability
              to build the infrastructure around those models rather
              than treating the model as an isolated component.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">

            {[
              ["ML", "Core"],
              ["GenAI", "Focus"],
              ["RAG", "Specialty"],
              ["AI Apps", "Build"],
            ].map(([title, subtitle], index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.06,
                }}
                className="rounded-3xl border border-white/10 bg-white/[0.025] p-6"
              >
                <p className="text-2xl font-medium text-white">
                  {title}
                </p>

                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-600">
                  {subtitle}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;