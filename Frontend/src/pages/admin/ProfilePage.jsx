import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../../components/admin/PageHeader";
import FieldGrid from "../../components/admin/FieldGrid";
import RepeaterField from "../../components/admin/RepeaterField";
import useForm from "../../hooks/useForm";
import { fetchProfile, saveProfile } from "../../services/admin/admin.service";
import { pickPaths } from "../../utils/objectPath";
import {
  ALL_PROFILE_FIELDS,
  PROFILE_GROUPS,
  SECTION_KEYS,
  SOCIAL_COLUMNS,
  STAT_COLUMNS,
  sectionFields,
} from "../../constants/adminProfile";
import defaultPortrait from "../../assets/images/aman-portrait.webp";
import defaultRoad from "../../assets/images/aman-road.webp";

const FALLBACK_PREVIEWS = { portraitUrl: defaultPortrait, secondaryPhotoUrl: defaultRoad };

const EMPTY_SECTION = { index: "", label: "", title: "", accent: "" };
/** Fill nested objects so a brand-new (unseeded) profile still validates. */
const withDefaults = (profile) => ({
  socials: [],
  stats: [],
  ...profile,
  status: { label: "Now", text: "", ...profile.status },
  quote: { text: "", author: "", ...profile.quote },
  sections: Object.fromEntries(
    SECTION_KEYS.map(({ key }) => [key, { ...EMPTY_SECTION, ...profile.sections?.[key] }]),
  ),
});
const cleanRows = (rows, keys) =>
  rows.map((row) => {
    const out = pickPaths(row, keys);
    if (row._id) out._id = row._id;
    return out;
  });

function Card({ title, description, children }) {
  return (
    <section className="rounded-lg border border-line bg-ink-2 p-5 sm:p-6">
      <h2 className="font-display text-xl tracking-wide uppercase">{title}</h2>
      {description && <p className="mt-1 text-xs text-dim">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ProfileForm({ initial }) {
  const form = useForm(withDefaults(initial));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const warn = (e) => {
      if (!form.dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [form.dirty]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...pickPaths(form.values, ALL_PROFILE_FIELDS),
        socials: cleanRows(form.values.socials, ["platform", "label", "url"]),
        stats: cleanRows(form.values.stats, ["value", "label"]),
      };
      const saved = await saveProfile(payload);
      form.reset(withDefaults(saved));
      toast.success("Profile saved — it's live on the site.");
    } catch (error) {
      form.setErrors(error.fieldErrors ?? {});
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6 pb-24">
      {PROFILE_GROUPS.map((group) => (
        <Card key={group.title} title={group.title}>
          <FieldGrid fields={group.fields} form={form} fallbacks={FALLBACK_PREVIEWS} />
        </Card>
      ))}

      <Card title="Social links" description="Shown in the contact card and footer.">
        <RepeaterField
          rows={form.values.socials}
          onChange={(rows) => form.setField("socials", rows)}
          columns={SOCIAL_COLUMNS}
          blank={{ platform: "github", label: "", url: "" }}
          addLabel="Add link"
          errors={form.errors}
          errorPrefix="socials"
        />
      </Card>

      <Card title="Hero stats" description="Big red numbers on the right of the hero. Up to 6; 3 look best.">
        <RepeaterField
          rows={form.values.stats}
          onChange={(rows) => form.setField("stats", rows)}
          columns={STAT_COLUMNS}
          blank={{ value: "", label: "" }}
          max={6}
          addLabel="Add stat"
          errors={form.errors}
          errorPrefix="stats"
        />
      </Card>

      <Card title="Section headings" description="The “01 / Selected work” labels and big titles. The accent part renders in red.">
        <div className="flex flex-col gap-6">
          {SECTION_KEYS.map(({ key, label }) => (
            <div key={key}>
              <p className="mb-3 font-mono text-[11px] tracking-[0.15em] text-blaze uppercase">{label}</p>
              <FieldGrid fields={sectionFields(key)} form={form} />
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 px-5 py-3 backdrop-blur md:left-60">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <p className="text-xs text-dim">{form.dirty ? "You have unsaved changes." : "All changes saved."}</p>
          <button
            type="submit"
            disabled={saving || !form.dirty}
            className="flex items-center gap-2 rounded-md bg-blaze px-5 py-2.5 text-sm font-semibold text-white hover:bg-ember disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save profile
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const [state, setState] = useState({ profile: null, error: null, loading: true });

  useEffect(() => {
    fetchProfile()
      .then((profile) => setState({ profile, error: null, loading: false }))
      .catch((error) =>
        // 404 = not seeded yet: start from an empty form.
        setState(error.status === 404 ? { profile: {}, error: null, loading: false } : { profile: null, error, loading: false }),
      );
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Profile & site" description="Your identity, hero text, photos, links and section headings." />
      {state.loading && (
        <p className="flex items-center gap-2 text-sm text-mute">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </p>
      )}
      {state.error && <p className="rounded-lg border border-blaze/40 bg-blaze/10 p-4 text-sm">{state.error.message}</p>}
      {state.profile && <ProfileForm initial={state.profile} />}
    </div>
  );
}
