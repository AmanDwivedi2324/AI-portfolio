import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
];

const Navbar = ({ onOpenChat }) => {
  const [open, setOpen] = useState(false);

  const handleNavigation = (href) => {
    setOpen(false);

    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-5 pt-5 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-xl sm:px-5">
          
          {/* Logo */}
          <button
            onClick={() => handleNavigation("#home")}
            className="text-lg font-semibold tracking-tight text-white"
          >
            AMAN<span className="text-violet-400">.</span>
          </button>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={onOpenChat}
              className="group flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200 transition-all hover:border-violet-400/60 hover:bg-violet-500/20"
            >
              <Sparkles size={15} />
              Ask AI
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg border border-white/10 p-2 text-zinc-300 md:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 rounded-2xl border border-white/10 bg-[#09090b]/95 p-4 backdrop-blur-xl md:hidden"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    className="rounded-xl px-4 py-3 text-left text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenChat();
                  }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
                >
                  <Sparkles size={16} />
                  Ask Aman AI
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;