import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import SectionHeading from "./SectionHeading";
import { portfolio } from "../data/portfolio";

const WorkPreview = () => {
    return (
        <section
            id="work"
            className="px-5 py-28 sm:px-8 lg:px-10"
        >
            <div className="mx-auto max-w-7xl">
                <SectionHeading
                    number="01"
                    eyebrow="Selected AI Work"
                    title="Building intelligent systems."
                />

                <div className="grid gap-5 md:grid-cols-2">
                    {portfolio.projects.map((project, index) => (
                        <motion.article
                            key={project.title}
                            initial={{ opacity: 0, y: 35 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{
                                once: true,
                                margin: "-80px",
                            }}
                            transition={{
                                duration: 0.55,
                                delay: index * 0.08,
                            }}
                            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#09090b] transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/25"
                        >
                            {/* Hover glow */}
                            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-600/[0.08] blur-[100px] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                            {/* Project visual area */}
                            <div className="relative mx-3 mt-3 h-[220px] overflow-hidden rounded-[22px] border border-white/[0.06] bg-[#0d0d10]">

                                {/* Grid */}
                                <div
                                    className="absolute inset-0 opacity-[0.08]"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
                                        backgroundSize: "35px 35px",
                                    }}
                                />

                                {/* Center AI visual */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/[0.05]">

                                        <div className="absolute inset-3 rounded-full border border-violet-400/10" />

                                        <div className="absolute inset-6 rounded-full border border-violet-400/10" />

                                        <div className="h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_30px_rgba(167,139,250,0.8)]" />
                                    </div>
                                </div>

                                {/* Project number */}
                                <div className="absolute left-5 top-5">
                                    <span className="text-xs font-medium text-zinc-600">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Category */}
                                <div className="absolute bottom-5 left-5">
                                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-400 backdrop-blur-md">
                                        {project.category}
                                    </span>
                                </div>

                                {/* Arrow */}
                                <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-zinc-600 backdrop-blur-md transition-all duration-300 group-hover:border-violet-400/30 group-hover:bg-violet-500/10 group-hover:text-white">
                                    <ArrowUpRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative p-6 sm:p-7">

                                {/* Title */}
                                <h3 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
                                    {project.title}
                                </h3>

                                {/* Description */}
                                <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                                    {project.description}
                                </p>

                                {/* Technologies */}
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {project.technologies.map((technology) => (
                                        <span
                                            key={technology}
                                            className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[10px] text-zinc-500 transition-colors group-hover:border-white/15 group-hover:text-zinc-400"
                                        >
                                            {technology}
                                        </span>
                                    ))}
                                </div>

                                {/* Bottom */}
                                <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-5">
                                    <span className="text-[11px] uppercase tracking-[0.15em] text-zinc-700">
                                        {project.category}
                                    </span>

                                    <button className="text-xs text-zinc-500 transition-colors hover:text-white">
                                        View project →
                                    </button>
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