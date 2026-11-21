import { useCallback, useState } from "react";
import { cn } from "../../utils/cn";

/**
 * <img> with a shimmering placeholder that fades into the image once it has
 * loaded (or stays as a neutral block if it fails).
 * `className` styles the image; `wrapperClassName` positions the wrapper.
 */
export default function SmartImage({ wrapperClassName, className, placeholderClassName, onLoad, ...imgProps }) {
  const [status, setStatus] = useState("loading");

  // Cached images can finish before React attaches onLoad — check on mount.
  const ref = useCallback((img) => {
    if (img?.complete && img.naturalWidth > 0) setStatus("loaded");
  }, []);

  const positioned = /\b(absolute|fixed)\b/.test(wrapperClassName ?? "");

  return (
    <div className={cn(!positioned && "relative", wrapperClassName)}>
      {status !== "loaded" && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 overflow-hidden bg-ink-3",
            status === "loading" && "skeleton",
            placeholderClassName,
          )}
        />
      )}
      <img
        ref={ref}
        {...imgProps}
        onLoad={(e) => {
          setStatus("loaded");
          onLoad?.(e);
        }}
        onError={() => setStatus("error")}
        className={cn(
          "transition-[opacity,scale] duration-500",
          status === "loaded" ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
}
