import { NextResponse } from "next/server";

import { verifyAdminCredentials } from "@/lib/auth/credentials";
import { getRequestOrigin } from "@/lib/auth/request-origin";
import { createAdminSessionCookie } from "@/lib/auth/session";
import { adminLoginSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  const origin = getRequestOrigin(request);
  const formData = await request.formData();
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = adminLoginSchema.safeParse(credentials);

  if (!result.success || !verifyAdminCredentials(result.data)) {
    return NextResponse.redirect(
      new URL("/admin/login?error=invalid_credentials", origin),
      { status: 303 },
    );
  }

  const response = NextResponse.redirect(new URL("/admin", origin), {
    status: 303,
  });
  const sessionCookie = createAdminSessionCookie(result.data.email);

  response.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.options,
  );

  return response;
}
