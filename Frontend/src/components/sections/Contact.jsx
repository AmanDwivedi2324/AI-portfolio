import { useState } from "react";
import toast from "react-hot-toast";
import { Check, Copy, Send } from "lucide-react";
import Assemble from "../agents/Assemble";
import Section from "../ui/Section";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { SOCIAL_ICONS } from "../../constants/techIcons";
import { contactErrorMessage, sendContactMessage } from "../../services/contact.service";

const EMPTY = { name: "", email: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-md border border-line bg-ink px-4 py-3 text-sm text-fg placeholder:text-dim transition-colors focus:border-agent focus:outline-none";

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Please enter a valid email.";
  if (form.message.trim().length < 10) errors.message = "A few more words, please (10+ characters).";
  return errors;
}

function ContactForm({ email }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSending(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        website: form.website,
      });
      toast.success("Message sent — thanks! I'll get back to you soon.");
      setForm(EMPTY);
    } catch (error) {
      toast.error(contactErrorMessage(error, email));
    } finally {
      setSending(false);
    }
  };

  const field = (name, label, props) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`contact-${name}`} className="font-mono text-[11px] tracking-[0.15em] text-mute uppercase">
        {label}
      </label>
      {props.as === "textarea" ? (
        <textarea
          id={`contact-${name}`}
          value={form[name]}
          onChange={update(name)}
          rows={5}
          className={`${inputClass} resize-none`}
          aria-invalid={Boolean(errors[name])}
          placeholder={props.placeholder}
        />
      ) : (
        <input
          id={`contact-${name}`}
          value={form[name]}
          onChange={update(name)}
          className={inputClass}
          aria-invalid={Boolean(errors[name])}
          {...props}
        />
      )}
      {errors[name] && <p className="text-xs text-blaze">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate aria-busy={sending}>
      <fieldset disabled={sending} className="flex flex-col gap-5 transition-opacity disabled:opacity-70">
        <div className="grid gap-5 sm:grid-cols-2">
          {field("name", "Name", { type: "text", autoComplete: "name", placeholder: "Your name" })}
          {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@company.com" })}
        </div>
        {field("message", "Message", { as: "textarea", placeholder: "What would you like to build?" })}
        {/* Honeypot: invisible to people, often filled in by spam bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={update("website")}
          />
        </div>
        <Button type="submit" disabled={sending} className="min-w-44 self-start">
          {sending ? (
            <>
              <Spinner size={15} /> Sending…
            </>
          ) : (
            <>
              Send message <Send size={15} />
            </>
          )}
        </Button>
      </fieldset>
    </form>
  );
}

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the address instead.");
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-1.5 rounded border border-line px-2 py-1 font-mono text-[10px] text-mute transition-colors hover:text-fg"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function Contact({ heading, profile }) {
  const details = [
    {
      label: "Email",
      value: (
        <a href={`mailto:${profile.email}`} className="hover:text-blaze">
          {profile.email}
        </a>
      ),
      action: <CopyEmail email={profile.email} />,
    },
    profile.showPhone &&
      profile.phone && {
        label: "Phone",
        value: (
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="hover:text-blaze">
            {profile.phone}
          </a>
        ),
      },
    { label: "Based in", value: profile.location },
    { label: "Focus", value: profile.focus },
  ].filter(Boolean);

  return (
    <Section id="contact">
      <SectionHeading id="contact" {...heading} />

      <div className="mt-14 grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Assemble id="contact.intro" as="p" className="text-lg leading-relaxed text-mute">
            Hiring for an AI role, or have a workflow you&apos;d like an agent to run? Send a message and I&apos;ll get
            back to you.
          </Assemble>
          <Assemble id="contact.details" className="rounded-xl border border-line bg-ink-2 p-6">
            <dl className="flex flex-col divide-y divide-line">
              {details.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                  <div className="min-w-0">
                    <dt className="font-mono text-[10px] tracking-[0.15em] text-dim uppercase">{row.label}</dt>
                    <dd className="mt-1 truncate text-sm text-fg">{row.value}</dd>
                  </div>
                  {row.action}
                </div>
              ))}
            </dl>
            <div className="mt-5 flex gap-2 border-t border-line pt-5">
              {profile.socials.map(({ _id, platform, label, url }) => {
                const Icon = SOCIAL_ICONS[platform];
                return (
                  <a
                    key={_id}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-xs text-mute transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {Icon && <Icon size={14} />} {label}
                  </a>
                );
              })}
            </div>
          </Assemble>
        </div>

        <Assemble id="contact.form" className="rounded-xl border border-line bg-ink-2 p-6 sm:p-8 lg:col-span-7">
          <ContactForm email={profile.email} />
        </Assemble>
      </div>
    </Section>
  );
}
