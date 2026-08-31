import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const projects = [
  {
    number: "01",
    category: "AI / RAG",
    title: "YouTube AI Assistant",
    description:
      "A RAG-powered assistant that allows users to ask questions about YouTube videos.",
    technologies: ["Python", "FastAPI", "LangChain", "Gemini", "Pinecone"],
  },
  {
    number: "02",
    category: "COMPUTER VISION",
    title: "Pharmaceutical Defect Detection",
    description:
      "A computer vision system designed to identify defects in pharmaceutical products.",
    technologies: ["Python", "CNN", "OpenCV", "TensorFlow", "Docker"],
  },
  {
    number: "03",
    category: "AUDIO ML",
    title: "Speech Emotion Recognition",
    description:
      "An audio classification system that detects emotional characteristics from speech.",
    technologies: ["Python", "CNN", "Librosa", "MLflow", "Docker"],
  },
];

const WorkPreview = () => {
  return (
    <section id="work" className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          number="01"
          eyebrow="Selected Work"
          title="Things I've built."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-violet-400/30 sm:p-8 ${
                index === 0 ? "lg:row-span-2" : ""
              }`}
            >
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-violet-500/10 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    {project.number}
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="text-zinc-600 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white"
                  />
                </div>

                <div className="mt-16 sm:mt-24">
                  <p className="mb-3 text-xs uppercase tracking-[0.18em] text-violet-400">
                    {project.category}
                  </p>

                  <h3 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
                    {project.title}
                  </h3>

                  <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500">
                    {project.description}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-500"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkPreview;