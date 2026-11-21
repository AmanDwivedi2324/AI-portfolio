import { SOCIAL_ICONS } from "./techIcons";

/** Field groups of the Profile & site page. Names are dotted paths into the profile. */
export const PROFILE_GROUPS = [
  {
    title: "Identity",
    fields: [
      { name: "firstName", label: "First name", type: "text", required: true },
      { name: "lastName", label: "Last name", type: "text", required: true, help: "Also the giant red word behind your photo." },
      { name: "role", label: "Role", type: "text", placeholder: "AI Engineer" },
      { name: "location", label: "Location", type: "text" },
      { name: "bio", label: "About-section bio", type: "textarea", rows: 4, span: 2 },
      { name: "focus", label: "Focus line", type: "text", help: "Shown in the contact card.", span: 2 },
    ],
  },
  {
    title: "Hero",
    fields: [
      { name: "greeting", label: "Greeting", type: "text", placeholder: "Hi, I'm" },
      { name: "eyebrow", label: "Top-left label", type: "text" },
      { name: "roleLine", label: "Red role line", type: "text", span: 2 },
      { name: "tagline", label: "Tagline", type: "textarea", span: 2 },
      { name: "status.label", label: "Status label", type: "text", placeholder: "Now" },
      { name: "status.text", label: "Status text", type: "text", help: "The live line, top right." },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "text" },
      { name: "showPhone", label: "Show phone on the site", type: "toggle", span: 2, help: "Off keeps it private (it isn't sent to visitors at all)." },
    ],
  },
  {
    title: "Photos & résumé",
    fields: [
      { name: "portraitUrl", label: "Hero portrait", type: "asset", kind: "image", span: 2, help: "A cut-out PNG/WebP with a transparent background looks best. Empty = current default photo." },
      { name: "secondaryPhotoUrl", label: "Quote-card photo", type: "asset", kind: "image", span: 2 },
      { name: "resumeUrl", label: "Résumé PDF", type: "asset", kind: "document", span: 2 },
    ],
  },
  {
    title: "Quote card",
    fields: [
      { name: "quote.text", label: "Quote", type: "textarea", rows: 2, span: 2 },
      { name: "quote.author", label: "Author", type: "text" },
    ],
  },
];

export const SECTION_KEYS = [
  { key: "work", label: "Projects section" },
  { key: "about", label: "About section" },
  { key: "journey", label: "Journey section" },
  { key: "contact", label: "Contact section" },
];

export const sectionFields = (key) => [
  { name: `sections.${key}.index`, label: "Number", type: "text", placeholder: "01" },
  { name: `sections.${key}.label`, label: "Label", type: "text" },
  { name: `sections.${key}.title`, label: "Title", type: "text" },
  { name: `sections.${key}.accent`, label: "Red accent", type: "text" },
];

export const SOCIAL_COLUMNS = [
  {
    name: "platform",
    label: "Platform",
    width: "9rem",
    options: Object.keys(SOCIAL_ICONS).map((key) => ({ value: key, label: key })),
  },
  { name: "label", label: "Label", width: "9rem" },
  { name: "url", label: "URL", placeholder: "https://…" },
];

export const STAT_COLUMNS = [
  { name: "value", label: "Value", width: "6rem", placeholder: "7+" },
  { name: "label", label: "Label", placeholder: "client projects delivered" },
];

export const ALL_PROFILE_FIELDS = [
  ...PROFILE_GROUPS.flatMap((g) => g.fields.map((f) => f.name)),
  ...SECTION_KEYS.flatMap(({ key }) => sectionFields(key).map((f) => f.name)),
];
