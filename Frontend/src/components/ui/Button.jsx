import { cn } from "../../utils/cn";

const VARIANTS = {
  primary: "bg-ember text-white hover:bg-blaze",
  ghost: "border border-line-strong text-fg hover:border-fg/60 hover:bg-white/5",
  dark: "bg-fg text-ink hover:bg-white",
};

/** Button that renders an <a> when given `href`, otherwise a <button>. */
export default function Button({ href, variant = "primary", className, children, ...rest }) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    VARIANTS[variant],
    className,
  );

  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} className={classes} {...(external && { target: "_blank", rel: "noreferrer" })} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
