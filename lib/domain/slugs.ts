const slugPattern = /[^a-z0-9]+/g;

export function slugifySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(slugPattern, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function joinSlugPath(segments: string[]) {
  return segments
    .map((segment) => slugifySegment(segment))
    .filter(Boolean)
    .join("/");
}

export function splitSlugPath(pathname: string) {
  return pathname
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
}
