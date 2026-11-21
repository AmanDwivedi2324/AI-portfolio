import { cn } from "../../utils/cn";

/** Page section with the shared max width and spacing. */
export default function Section({ id, className, innerClassName, children, ...rest }) {
  return (
    <section id={id} className={cn("relative px-5 py-24 sm:px-8 md:py-32", className)} {...rest}>
      <div className={cn("mx-auto w-full max-w-7xl", innerClassName)}>{children}</div>
    </section>
  );
}
