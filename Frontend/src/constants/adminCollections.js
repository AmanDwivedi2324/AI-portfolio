import { TECH_ICONS } from "./techIcons";

const iconOptions = [
  { value: "", label: "No icon" },
  ...Object.keys(TECH_ICONS)
    .sort()
    .map((key) => ({ value: key, label: key })),
];

const visibleField = { name: "visible", label: "Show on the site", type: "toggle", help: "Turn off to hide without deleting." };

/**
 * One entry per CRM collection. CollectionPage renders the list + editor
 * from this config, so adding a field to a collection is a one-line change
 * here (plus the backend model/validator).
 */
export const ADMIN_COLLECTIONS = {
  projects: {
    resource: "projects",
    title: "Projects",
    singular: "project",
    description: "Cards in the “Selected work” section. Order here = order on the site.",
    primary: (item) => item.title,
    secondary: (item) => [item.category, item.client].filter(Boolean).join(" · "),
    badges: (item) => (item.featured ? ["Featured"] : []),
    empty: { title: "", client: "", category: "", summary: "", highlights: [], techStack: [], pipeline: [], imageUrl: "", links: { github: "", live: "", docs: "" }, featured: false, visible: true },
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "client", label: "Client / subtitle", type: "text", placeholder: "e.g. Blog writing agent" },
      { name: "category", label: "Category", type: "text", required: true, help: "Becomes a filter tab.", suggestions: ["Agents", "RAG", "Automation", "Machine Learning", "Full Stack"] },
      { name: "slug", label: "URL slug", type: "text", help: "Leave empty to generate from the title." },
      { name: "summary", label: "Summary", type: "textarea", required: true, span: 2 },
      { name: "highlights", label: "Highlights", type: "lines", span: 2, help: "One per line." },
      { name: "techStack", label: "Tech stack", type: "tags", span: 2, help: "Comma separated." },
      { name: "pipeline", label: "Pipeline steps", type: "tags", span: 2, help: "Comma separated, 3–6 short steps. Shown as the animated graph when there is no image." },
      { name: "imageUrl", label: "Screenshot (optional)", type: "asset", kind: "image", span: 2, help: "Replaces the pipeline graph on the card." },
      { name: "links.github", label: "GitHub URL", type: "url" },
      { name: "links.live", label: "Live URL", type: "url" },
      { name: "links.docs", label: "Docs / architecture URL", type: "url" },
      { name: "featured", label: "Featured", type: "toggle" },
      visibleField,
    ],
  },

  skills: {
    resource: "skills",
    title: "Skills",
    singular: "skill",
    description: "Grouped by category in the About section. Featured skills with an icon scroll in the tools strip.",
    primary: (item) => item.name,
    secondary: (item) => item.category,
    badges: (item) => [item.featured && "Tools strip", item.icon && `icon: ${item.icon}`].filter(Boolean),
    empty: { name: "", category: "", icon: "", featured: false, visible: true },
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "category", label: "Category", type: "text", required: true, suggestions: ["Generative AI", "Agentic AI", "Machine Learning", "Engineering", "Data", "GTM Automation", "Programming", "Tools"] },
      { name: "icon", label: "Icon", type: "select", options: iconOptions, help: "Shown in the tools strip." },
      { name: "featured", label: "Show in the tools strip", type: "toggle" },
      visibleField,
    ],
  },

  experience: {
    resource: "experience",
    title: "Experience",
    singular: "role",
    description: "The Journey timeline. Put the most recent role first.",
    primary: (item) => `${item.role} · ${item.company}`,
    secondary: (item) => `${item.startDate} — ${item.current ? "Present" : item.endDate}`,
    badges: (item) => (item.current ? ["Current"] : []),
    empty: { company: "", role: "", location: "", startDate: "", endDate: "", current: false, highlights: [], visible: true },
    fields: [
      { name: "company", label: "Company", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "location", label: "Location", type: "text" },
      { name: "startDate", label: "Start", type: "text", required: true, placeholder: "Nov 2026" },
      { name: "endDate", label: "End", type: "text", placeholder: "Feb 2027", help: "Ignored while “current” is on." },
      { name: "current", label: "I work here now", type: "toggle", help: "Shows a live dot and the “Currently” card." },
      { name: "highlights", label: "Highlights", type: "lines", span: 2, rows: 5, help: "One per line. Wrap numbers in **double asterisks** to highlight them in red." },
      visibleField,
    ],
  },

  education: {
    resource: "education",
    title: "Education",
    singular: "entry",
    description: "Shown in the About section.",
    primary: (item) => item.degree,
    secondary: (item) => item.institution,
    badges: () => [],
    empty: { institution: "", degree: "", location: "", startDate: "", endDate: "", score: "", visible: true },
    fields: [
      { name: "degree", label: "Degree", type: "text", required: true, span: 2 },
      { name: "institution", label: "Institution", type: "text", required: true, span: 2 },
      { name: "location", label: "Location", type: "text" },
      { name: "score", label: "Score", type: "text", placeholder: "CGPA 8.59 / 10" },
      { name: "startDate", label: "Start", type: "text" },
      { name: "endDate", label: "End", type: "text" },
      visibleField,
    ],
  },

  process: {
    resource: "process",
    title: "Process",
    singular: "step",
    description: "The numbered “How I build an agent” timeline.",
    primary: (item) => item.title,
    secondary: (item) => item.description,
    badges: () => [],
    empty: { title: "", description: "", visible: true },
    fields: [
      { name: "title", label: "Title", type: "text", required: true, span: 2 },
      { name: "description", label: "Description", type: "textarea", required: true, span: 2 },
      visibleField,
    ],
  },
};
