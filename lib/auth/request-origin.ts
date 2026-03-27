export function getRequestOrigin(request: Request) {
  const explicitOrigin = request.headers.get("origin");
  if (explicitOrigin) {
    return explicitOrigin;
  }

  const protocol = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    new URL(request.url).host;

  return `${protocol}://${host}`;
}
