import { cn } from "../../../utils/cn";

/** Label + help text + error message around any input. */
export default function FieldShell({ id, label, help, error, required, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-mute">
          {label}
          {required && <span className="text-blaze"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-blaze" role="alert">
          {error}
        </p>
      ) : (
        help && <p className="text-xs text-dim">{help}</p>
      )}
    </div>
  );
}
