"use server";

import { redirect } from "next/navigation";

import { verifyAdminCredentials } from "@/lib/auth/credentials";
import { createAdminSession } from "@/lib/auth/session";
import { adminLoginSchema } from "@/lib/validation/auth";

export async function loginAction(formData: FormData) {
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = adminLoginSchema.safeParse(credentials);

  if (!result.success || !verifyAdminCredentials(result.data)) {
    redirect("/admin/login?error=invalid_credentials");
  }

  await createAdminSession(result.data.email);
  redirect("/admin");
}
