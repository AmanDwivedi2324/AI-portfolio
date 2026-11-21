import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import LogoMark from "../../components/ui/LogoMark";
import FieldShell from "../../components/admin/fields/FieldShell";
import { inputClass } from "../../components/admin/fields/styles";
import useAuth from "../../hooks/useAuth";

export default function LoginPage() {
  const { status, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (status === "signedIn") return <Navigate to={location.state?.from ?? "/admin"} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(values.username, values.password);
      navigate(location.state?.from ?? "/admin", { replace: true });
    } catch (err) {
      setError(err.message);
      setValues((v) => ({ ...v, password: "" }));
    } finally {
      setBusy(false);
    }
  };

  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  return (
    <main className="dot-grid flex min-h-svh items-center justify-center bg-ink px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-line-strong bg-ink-2 p-7 shadow-2xl shadow-black/60">
        <div className="mb-7 flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div>
            <h1 className="font-display text-2xl tracking-wide uppercase">Portfolio CRM</h1>
            <p className="text-xs text-dim">Sign in to edit your site</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <FieldShell id="login-username" label="Username">
            <input id="login-username" autoComplete="username" value={values.username} onChange={set("username")} required className={inputClass} autoFocus />
          </FieldShell>
          <FieldShell id="login-password" label="Password">
            <input id="login-password" type="password" autoComplete="current-password" value={values.password} onChange={set("password")} required className={inputClass} />
          </FieldShell>
          {error && (
            <p className="rounded-md border border-blaze/40 bg-blaze/10 px-3 py-2 text-sm text-fg" role="alert">
              {error}
            </p>
          )}
          <button type="submit" disabled={busy} className="mt-1 flex items-center justify-center gap-2 rounded-md bg-blaze px-5 py-3 text-sm font-semibold text-white hover:bg-ember disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" />}
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
}
