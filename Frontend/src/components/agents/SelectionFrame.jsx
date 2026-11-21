const HANDLES = [
  { top: -4, left: -4 },
  { top: -4, right: -4 },
  { bottom: -4, left: -4 },
  { bottom: -4, right: -4 },
];

/** Cyan design-tool style selection box an agent draws while working. */
export default function SelectionFrame({ tag }) {
  return (
    <span className="sel-frame" aria-hidden="true">
      {tag && <span className="sel-frame__tag">{tag}</span>}
      {HANDLES.map((pos, i) => (
        <span key={i} className="sel-frame__handle" style={pos} />
      ))}
    </span>
  );
}
