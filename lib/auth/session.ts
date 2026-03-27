import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const ADMIN_SESSION_COOKIE_NAME = "ata_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

type AdminSession = {
  email: string;
  role: "admin";
  expiresAt: string;
};

function getSecret() {
  return process.env.AUTH_SECRET ?? "development-auth-secret";
}

export function shouldUseSecureAdminCookie() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return process.env.NODE_ENV === "production" && siteUrl.startsWith("https://");
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function encodeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function buildAdminSession(email: string) {
  return {
    email,
    role: "admin" as const,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}

function buildAdminSessionCookieOptions(expiresAt: string): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(),
    path: "/",
    expires: new Date(expiresAt),
  };
}

export function createAdminSessionCookie(email: string) {
  const session = buildAdminSession(email);
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: encodeSession(session),
    options: buildAdminSessionCookieOptions(session.expiresAt),
  };
}

function decodeSession(token: string): AdminSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as AdminSession;

    if (new Date(session.expiresAt) <= new Date()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string) {
  const sessionCookie = createAdminSessionCookie(email);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return decodeSession(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
