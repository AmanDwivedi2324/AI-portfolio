import { Github, Linkedin, Mail } from "lucide-react";
import { portfolio } from "../data/portfolio";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-lg font-semibold">
            AMAN<span className="text-violet-400">.</span>
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            AI / ML Engineer
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={portfolio.social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-zinc-500 transition hover:text-white"
          >
            <Github size={16} />
          </a>

          <a
            href={portfolio.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 p-2.5 text-zinc-500 transition hover:text-white"
          >
            <Linkedin size={16} />
          </a>

          <a
            href={`mailto:${portfolio.social.email}`}
            className="rounded-full border border-white/10 p-2.5 text-zinc-500 transition hover:text-white"
          >
            <Mail size={16} />
          </a>
        </div>

        <p className="text-xs text-zinc-700">
          © {new Date().getFullYear()} Aman Dwivedi
        </p>

      </div>
    </footer>
  );
};

export default Footer;