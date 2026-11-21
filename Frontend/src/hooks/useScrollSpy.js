import { useEffect, useState } from "react";

/** Returns the id of the section currently in the middle band of the viewport. */
export default function useScrollSpy(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key]);

  return active;
}
