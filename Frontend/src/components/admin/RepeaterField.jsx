import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { inputClass } from "./fields/styles";
import { cn } from "../../utils/cn";

/**
 * Editable list of small objects (social links, stats).
 * columns: [{ name, label, placeholder, options?, width? }]
 */
export default function RepeaterField({ rows, onChange, columns, blank, max = 10, addLabel = "Add row", errors = {}, errorPrefix }) {
  const update = (index, name, value) => onChange(rows.map((row, i) => (i === index ? { ...row, [name]: value } : row)));
  const remove = (index) => onChange(rows.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const next = [...rows];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, index) => (
        <div key={row._id ?? `new-${index}`} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: columns.map((c) => c.width ?? "1fr").join(" ") }}>
            {columns.map((col) => {
              const error = errors[`${errorPrefix}.${index}.${col.name}`];
              const props = {
                value: row[col.name] ?? "",
                onChange: (e) => update(index, col.name, e.target.value),
                "aria-label": `${col.label} ${index + 1}`,
                "aria-invalid": error ? true : undefined,
                title: error,
                className: inputClass,
              };
              return col.options ? (
                <select key={col.name} {...props}>
                  {col.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input key={col.name} placeholder={col.placeholder ?? col.label} {...props} />
              );
            })}
          </div>
          <div className="flex shrink-0 items-center pt-1">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded p-1.5 text-dim hover:text-fg disabled:opacity-30" aria-label="Move up">
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === rows.length - 1}
              className="rounded p-1.5 text-dim hover:text-fg disabled:opacity-30"
              aria-label="Move down"
            >
              <ArrowDown size={14} />
            </button>
            <button type="button" onClick={() => remove(index)} className="rounded p-1.5 text-dim hover:text-blaze" aria-label="Remove">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { ...blank }])}
        disabled={rows.length >= max}
        className={cn("mt-1 flex items-center gap-1.5 self-start rounded-md border border-dashed border-line-strong px-3 py-2 text-xs text-mute hover:text-fg", rows.length >= max && "opacity-40")}
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}
