"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { updateInquiryReview } from "@/lib/domain/inquiries";
import { toNullableString, toRequiredString } from "@/lib/admin/utils";

export async function saveInquiryReviewAction(formData: FormData) {
  const id = toRequiredString(formData.get("id"));
  const selected = toNullableString(formData.get("selected")) ?? id;

  await updateInquiryReview(prisma, {
    id,
    status: toRequiredString(formData.get("status")) as
      | "new"
      | "qualified"
      | "answered"
      | "closed"
      | "spam",
    internalNotes: toNullableString(formData.get("internalNotes")),
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  redirect(`/admin/inquiries?selected=${selected}&saved=1`);
}
