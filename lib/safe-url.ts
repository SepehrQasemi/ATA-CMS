type SanitizeHrefOptions = {
  allowRelative?: boolean;
  protocols?: string[];
};

export function sanitizeHref(
  value: string | null | undefined,
  options: SanitizeHrefOptions = {},
) {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!normalized) {
    return null;
  }

  if (options.allowRelative && normalized.startsWith("/") && !normalized.startsWith("//")) {
    return normalized;
  }

  try {
    const url = new URL(normalized);
    const protocols = new Set(options.protocols ?? ["http:", "https:"]);
    return protocols.has(url.protocol) ? normalized : null;
  } catch {
    return null;
  }
}
