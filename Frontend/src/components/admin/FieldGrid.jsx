import FieldRenderer from "./fields/FieldRenderer";
import { getIn } from "../../utils/objectPath";

/** Two-column grid of config-driven fields bound to a useForm() instance. */
export default function FieldGrid({ fields, form, fallbacks = {} }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          value={getIn(form.values, field.name)}
          onChange={(value) => form.setField(field.name, value)}
          draft={form.drafts[field.name]}
          onDraft={(text) => form.setDraft(field.name, text)}
          error={form.errors[field.name]}
          fallbackPreview={fallbacks[field.name]}
        />
      ))}
    </div>
  );
}
