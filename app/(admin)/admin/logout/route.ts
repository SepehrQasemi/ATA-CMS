import { NextResponse } from "next/server";

import { getRequestOrigin } from "@/lib/auth/request-origin";
import { ADMIN_SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function GET(request: Request) {
  const response = NextResponse.redirect(
    new URL("/admin/login", getRequestOrigin(request)),
  );
  response.cookies.delete(ADMIN_SESSION_COOKIE_NAME);
  return response;
}
