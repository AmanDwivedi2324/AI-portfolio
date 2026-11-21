/** "BlogPilot — Blog Agent!" → "blogpilot-blog-agent" */
export default function slugify(text = "") {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
