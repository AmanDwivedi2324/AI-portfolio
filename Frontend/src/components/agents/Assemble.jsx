import { useLayoutEffect, useRef } from "react";
import SelectionFrame from "./SelectionFrame";
import { useAssemblyStore, useAssemblyTarget } from "../../hooks/useAssembly";
import { cn } from "../../utils/cn";

/**
 * Wrap any element to make it something the agents build.
 *
 *   <Assemble id="hero.title" as="h1" variant="type">AMAN.</Assemble>
 *
 * - `id`      unique, stable key (also the label shown on the selection tag)
 * - `as`      element to render (must accept children — wrap <img> in a div)
 * - `variant` "rise" (default) | "type" (left-to-right reveal) | "scale" | "fade"
 *
 * Do not nest <Assemble> inside another: a hidden parent hides its children.
 */
export default function Assemble({
  id,
  label,
  as = "div",
  variant = "rise",
  className,
  children,
  ...rest
}) {
  const Tag = as;
  const store = useAssemblyStore();
  const ref = useRef(null);
  const { state, agent, inspect } = useAssemblyTarget(id);
  const name = label ?? id;

  useLayoutEffect(() => {
    store.attach(id, ref.current, name);
    return () => store.detach(id);
  }, [store, id, name]);

  const showFrame = state === "building" || Boolean(inspect);

  return (
    <Tag ref={ref} data-asm={state} data-variant={variant} className={cn("asm", className)} {...rest}>
      {children}
      {showFrame && <SelectionFrame tag={`${agent ?? inspect} · ${name}`} />}
    </Tag>
  );
}
