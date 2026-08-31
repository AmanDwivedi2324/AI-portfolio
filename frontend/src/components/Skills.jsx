import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const groups = [
  {
    number: "01",
    title: "Machine Learning",
    description:
      "Building, evaluating and deploying machine learning and deep learning solutions.",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Audio ML",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
    ],
  },
  {
    number: "02",
    title: "Generative AI",
    description:
      "Building applications around LLMs, retrieval systems and intelligent agents.",
    skills: [
      "LLMs",
      "RAG",
      "Embeddings",
      "Vector Databases",
      "LangChain",
      "Prompt Engineering",
      "AI Agents",
    ],
  },
  {
    number: "03",
    title: "AI Engineering",
    description:
      "Turning models and AI workflows into usable, production-oriented applications.",
    skills: [
      "Python",
      "FastAPI",
      "REST APIs",
      "Model Serving",
      "MLflow",
      "Docker",
      "ETL Pipelines",
    ],
  },
  {
    number: "04",
    title: "Engineering Foundation",
    description:
      "Software engineering skills that support scalable AI applications.",
    skills: [
      "React",
      "Node.js",
      "Next.js",
      "MongoDB",
      "PostgreSQL",
      "Microservices",
      "Kafka",
      "Redis",
    ],
  },
];

const Skills = () => {
  return (
    <section className="px-5 py-28 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <SectionHeading
          number="03"
          eyebrow="Capabilities"
          title="What I build with."
        />

        <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-2">
          {groups.map((group, index) => (
            <motion.div
              key={group.number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
              }}
              className="bg-[#080808] p-7 sm:p-9"
            >
              <div className="flex justify-between">
                <span className="text-xs text-zinc-700">
                  {group.number}
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-violet-400/70" />
              </div>

              <h3 className="mt-14 text-2xl font-medium tracking-tight text-white">
                {group.title}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
                {group.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;