/** Read a dotted path: getIn({ links: { github: "x" } }, "links.github") → "x" */
export const getIn = (obj, path) => path.split(".").reduce((acc, key) => acc?.[key], obj);

/** Immutable write of a dotted path. */
export function setIn(obj, path, value) {
  const [key, ...rest] = path.split(".");
  if (!rest.length) return { ...obj, [key]: value };
  return { ...obj, [key]: setIn(obj?.[key] ?? {}, rest.join("."), value) };
}

/** Build an object containing only the given dotted paths of `source`. */
export const pickPaths = (source, paths) => paths.reduce((acc, path) => setIn(acc, path, getIn(source, path)), {});
