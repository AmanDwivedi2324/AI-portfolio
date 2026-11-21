import { useEffect, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import FieldGrid from "./FieldGrid";
import useForm from "../../hooks/useForm";
import { createItem, updateItem } from "../../services/admin/admin.service";
import { pickPaths } from "../../utils/objectPath";

/**
 * Slide-over form to create or edit one collection item. Built entirely
 * from the collection config (see constants/adminCollections.js).
 */
export default function EditorPanel({ config, item, onClose, onSaved }) {
  const isNew = !item?._id;
  const fieldNames = config.fields.map((f) => f.name);
  const form = useForm(pickPaths({ ...config.empty, ...item, links: { ...config.empty.links, ...item?.links } }, fieldNames));
  const [saving, setSaving] = useState(false);
  const panelRef = useRef(null);

  const requestClose = () => {
    if (!form.dirty || window.confirm("Discard your unsaved changes?")) onClose();
  };

  useEffect(() => {
    panelRef.current?.querySelector("input, textarea, select")?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && requestClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = pickPaths(form.values, fieldNames);
      const saved = isNew ? await createItem(config.resource, payload) : await updateItem(config.resource, item._id, payload);
      toast.success(isNew ? `Added ${config.singular}.` : "Saved.");
      onSaved(saved);
    } catch (error) {
      form.setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close editor" onClick={requestClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <form
        ref={panelRef}
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-label={isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-line-strong bg-ink-2 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-2xl tracking-wide uppercase">
            {isNew ? `New ${config.singular}` : `Edit ${config.singular}`}
          </h2>
          <button type="button" onClick={requestClose} className="rounded-md p-1.5 text-mute hover:bg-white/5 hover:text-fg" aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <FieldGrid fields={config.fields} form={form} />
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">
          <button type="button" onClick={requestClose} className="rounded-md px-4 py-2.5 text-sm text-mute hover:text-fg">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-blaze px-5 py-2.5 text-sm font-semibold text-white hover:bg-ember disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {isNew ? `Add ${config.singular}` : "Save changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}
