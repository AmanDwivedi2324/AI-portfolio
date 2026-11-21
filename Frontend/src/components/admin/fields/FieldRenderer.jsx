import FieldShell from "./FieldShell";
import { inputClass } from "./styles";
import AssetField from "./AssetField";
import { cn } from "../../../utils/cn";

const toLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
const toTags = (text) =>
  text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

/**
 * Renders one form field from a config object:
 *   { name, label, type, required, help, placeholder, rows, options, kind, span }
 * Types: text | email | url | textarea | lines | tags | select | toggle | asset
 *
 * `lines` and `tags` edit string arrays (one per line / comma separated).
 * They keep a local draft so typing a trailing comma or newline feels natural.
 */
export default function FieldRenderer({ field, value, onChange, error, draft, onDraft, fallbackPreview }) {
  const id = `field-${field.name.replace(/\./g, "-")}`;
  const shell = { id, label: field.label, help: field.help, error, required: field.required };
  const common = { id, "aria-invalid": error ? true : undefined, placeholder: field.placeholder };
  const span = field.span === 2 ? "sm:col-span-2" : undefined;

  switch (field.type) {
    case "textarea":
      return (
        <FieldShell {...shell} className={span}>
          <textarea {...common} rows={field.rows ?? 3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "resize-y")} />
        </FieldShell>
      );

    case "lines":
      return (
        <FieldShell {...shell} className={span}>
          <textarea
            {...common}
            rows={field.rows ?? 4}
            value={draft ?? (value ?? []).join("\n")}
            onChange={(e) => {
              onDraft(e.target.value);
              onChange(toLines(e.target.value));
            }}
            className={cn(inputClass, "resize-y font-mono text-xs leading-relaxed")}
          />
        </FieldShell>
      );

    case "tags":
      return (
        <FieldShell {...shell} className={span}>
          <input
            {...common}
            value={draft ?? (value ?? []).join(", ")}
            onChange={(e) => {
              onDraft(e.target.value);
              onChange(toTags(e.target.value));
            }}
            className={inputClass}
          />
        </FieldShell>
      );

    case "select":
      return (
        <FieldShell {...shell} className={span}>
          <select {...common} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FieldShell>
      );

    case "toggle":
      return (
        <div className={cn("flex items-start gap-3 rounded-md border border-line bg-ink px-3 py-2.5", span)}>
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#f2242f]" />
          <label htmlFor={id} className="flex flex-col gap-0.5">
            <span className="text-sm text-fg">{field.label}</span>
            {field.help && <span className="text-xs text-dim">{field.help}</span>}
          </label>
        </div>
      );

    case "asset":
      return (
        <FieldShell {...shell} className={span}>
          <AssetField id={id} value={value} onChange={onChange} kind={field.kind} fallbackPreview={fallbackPreview} invalid={Boolean(error)} />
        </FieldShell>
      );

    default:
      return (
        <FieldShell {...shell} className={span}>
          <input
            {...common}
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            list={field.suggestions ? `${id}-list` : undefined}
            className={inputClass}
          />
          {field.suggestions && (
            <datalist id={`${id}-list`}>
              {field.suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </FieldShell>
      );
  }
}
