import { useSyncExternalStore } from "react";

/** Subscribe to a CSS media query, e.g. useMediaQuery("(min-width: 768px)"). */
export default function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
