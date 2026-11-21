import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/admin/PageHeader";
import FieldShell from "../../components/admin/fields/FieldShell";
import { inputClass } from "../../components/admin/fields/styles";
import useAuth from "../../hooks/useAuth";
import { changePassword } from "../../services/admin/admin.service";

const MIN = 10;

export default function AccountPage() {
  const { user, updateSession } = useAuth();
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (name) => (e) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = {};
    if (values.newPassword.length < MIN) found.newPassword = `Use at least ${MIN} characters.`;
    if (values.confirm !== values.newPassword) found.confirm = "Passwords don't match.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      updateSession(await changePassword(values.currentPassword, values.newPassword));
      setValues({ currentPassword: "", newPassword: "", confirm: "" });
      toast.success("Password changed. Other devices have been signed out.");
    } catch (error) {
      setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, autoComplete, help) => (
    <FieldShell id={`acct-${name}`} label={label} error={errors[name]} help={help}>
      <input
        id={`acct-${name}`}
        type="password"
        autoComplete={autoComplete}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? true : undefined}
        className={inputClass}
      />
    </FieldShell>
  );

  return (
    <div className="max-w-md">
      <PageHeader title="Account" description={`Signed in as ${user?.username}.`} />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 rounded-lg border border-line bg-ink-2 p-6">
        <h2 className="font-display text-xl tracking-wide uppercase">Change password</h2>
        {field("currentPassword", "Current password", "current-password")}
        {field("newPassword", "New password", "new-password", `At least ${MIN} characters. A short sentence works well.`)}
        {field("confirm", "Repeat new password", "new-password")}
        <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 rounded-md bg-blaze px-5 py-2.5 text-sm font-semibold text-white hover:bg-ember disabled:opacity-60">
          {saving && <Loader2 size={15} className="animate-spin" />}
          Change password
        </button>
      </form>
    </div>
  );
}
