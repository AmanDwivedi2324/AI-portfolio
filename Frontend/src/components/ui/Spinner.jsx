import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

/** Inline loading spinner. Pair it with visible text (or `label`) for screen readers. */
export default function Spinner({ size = 16, className, label }) {
  return (
    <>
      <Loader2 size={size} className={cn("animate-spin", className)} aria-hidden="true" />
      {label && <span className="sr-only">{label}</span>}
    </>
  );
}
