"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import {
  toInteger,
  toNullableString,
  toRequiredString,
} from "@/lib/admin/utils";
import { mediaFormSchema } from "@/lib/validation/cms";

export async function saveMediaAction(formData: FormData) {
  const id = toNullableString(formData.get("id"));

  const rawInput = {
    id,
    kind: toRequiredString(formData.get("kind")),
    storageKey: toRequiredString(formData.get("storageKey")),
    publicUrl: toNullableString(formData.get("publicUrl")),
    mimeType: toRequiredString(formData.get("mimeType")),
    originalFilename: toNullableString(formData.get("originalFilename")),
    title: toNullableString(formData.get("title")),
    width: formData.get("width") ? toInteger(formData.get("width")) : null,
    height: formData.get("height") ? toInteger(formData.get("height")) : null,
    bytes: formData.get("bytes") ? toInteger(formData.get("bytes")) : null,
  };

  const parsed = mediaFormSchema.safeParse(rawInput);

  if (!parsed.success) {
    const issue = parsed.error.issues[0]?.message ?? "Media validation failed.";
    redirect(`/admin/media?error=${encodeURIComponent(issue)}`);
  }

  const storageConflict = await prisma.media.findUnique({
    where: { storageKey: parsed.data.storageKey },
    select: { id: true },
  });

  if (storageConflict && storageConflict.id !== parsed.data.id) {
    redirect(
      `/admin/media?error=${encodeURIComponent("Storage key must be unique.")}`,
    );
  }

  const payload = {
    kind: parsed.data.kind,
    storageKey: parsed.data.storageKey,
    publicUrl: parsed.data.publicUrl,
    mimeType: parsed.data.mimeType,
    originalFilename: parsed.data.originalFilename,
    title: parsed.data.title,
    width: parsed.data.width,
    height: parsed.data.height,
    bytes: parsed.data.bytes,
  };

  await (parsed.data.id
    ? prisma.media.update({
        where: { id: parsed.data.id },
        data: payload,
      })
    : prisma.media.create({
        data: payload,
      }));

  revalidatePath("/admin");
  revalidatePath("/admin/media");
  redirect("/admin/media?saved=1");
}
