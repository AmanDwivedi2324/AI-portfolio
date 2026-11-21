import { TECH_ICONS } from "../../constants/techIcons";
import { cn } from "../../utils/cn";

/** Brand icon for a skill, or a monogram tile when no icon is registered. */
export default function TechIcon({ icon, name, size = 28, className }) {
  const entry = TECH_ICONS[icon];
  if (entry) {
    const { Icon, color } = entry;
    return <Icon size={size} className={className} style={{ "--brand": color }} aria-hidden="true" />;
  }
  const initials = name
    .split(/[\s.-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={cn("inline-flex items-center justify-center rounded font-mono font-medium", className)}
      style={{ width: size, height: size, fontSize: size * 0.42, border: "1.5px solid currentColor" }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
