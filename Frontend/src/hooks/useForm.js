import { useCallback, useState } from "react";
import { setIn } from "../utils/objectPath";

/**
 * Minimal form state for the CRM: values (nested, by dotted path), raw
 * drafts for list/tag inputs, and per-field server errors.
 */
export default function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [drafts, setDrafts] = useState({});
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const setField = useCallback((name, value) => {
    setValues((current) => setIn(current, name, value));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    setDirty(true);
  }, []);

  const setDraft = useCallback((name, text) => setDrafts((current) => ({ ...current, [name]: text })), []);

  const reset = useCallback((next) => {
    setValues(next);
    setDrafts({});
    setErrors({});
    setDirty(false);
  }, []);

  return { values, setField, drafts, setDraft, errors, setErrors, dirty, setDirty, reset };
}
