import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Assemble from "../agents/Assemble";
import LogoMark from "../ui/LogoMark";
import useScrollSpy from "../../hooks/useScrollSpy";
import { NAV_LINKS } from "../../constants/site";
import { cn } from "../../utils/cn";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

export default function Navbar({ firstName = "Aman" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open ? "border-b border-line bg-ink/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <Assemble id="nav.logo" variant="fade">
          <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <LogoMark className="h-7 w-7" />
            <span className="font-display text-xl tracking-wide uppercase">
              {firstName}
              <span className="text-blaze">.</span>
            </span>
          </a>
        </Assemble>

        <Assemble id="nav.links" variant="fade" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                    active === link.id ? "text-fg" : "text-mute hover:text-fg",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full bg-blaze transition-opacity",
                      active === link.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Assemble>

        <div className="flex items-center gap-2">
          <Assemble id="nav.cta" variant="fade" className="hidden sm:block">
            <a
              href="#contact"
              className="group flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm text-fg transition-colors hover:border-blaze hover:text-white"
            >
              Let&apos;s talk
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Assemble>
          <button
            type="button"
            className="rounded-md p-2 text-fg md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="border-t border-line px-5 pt-2 pb-5 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-line py-4 font-display text-2xl tracking-wide uppercase"
              >
                {link.label}
                <ArrowUpRight size={18} className="text-blaze" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
