/** Renders text with **bold** segments highlighted (used for metrics in bullets). */
export default function RichText({ text, strongClassName = "font-semibold text-fg" }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={strongClassName}>
        {part}
      </strong>
    ) : (
      part
    ),
  );
}
