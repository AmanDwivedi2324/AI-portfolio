import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { portfolio } from "../data/portfolio";

const Experience = () => {
  return (
    <section
      id="experience"
      className="px-5 py-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          number="04"
          eyebrow="Experience"
          title="Building beyond prototypes."
        />

        <div className="space-y-5">
          {portfolio.experiences.map((experience, index) => (
            <motion.div
              key={`${experience.company}-${index}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
              }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
            >
              <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[220px_1fr]">
                
                {/* Experience Meta */}
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-zinc-600">
                    {experience.period}
                  </p>

                  <div className="mt-4 space-y-1">
                    {experience.roles.map((role) => (
                      <p
                        key={role}
                        className="text-sm text-violet-400"
                      >
                        {role}
                      </p>
                    ))}
                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    {experience.company}
                  </p>
                </div>

                {/* Experience Content */}
                <div>
                  <h3 className="text-2xl font-medium tracking-tight text-white">
                    AI engineering in a production environment.
                  </h3>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500">
                    Worked across machine learning, NLP, data processing and
                    application development, while also contributing to the
                    backend systems required to bring AI capabilities into
                    real applications.
                  </p>

                  {/* Highlights */}
                  <div className="mt-8 space-y-3">
                    {experience.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex gap-3"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />

                        <p className="text-sm leading-6 text-zinc-500">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {[
                      ["0.89", "Admission predictor R²"],
                      ["40%", "Data optimization"],
                      ["35%", "Model latency reduction"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-white/10 p-5"
                      >
                        <p className="text-2xl font-medium text-white">
                          {value}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-zinc-600">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;