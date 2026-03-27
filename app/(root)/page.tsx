import { redirect } from "next/navigation";

import { defaultPublicLocale } from "@/lib/i18n/config";

export default function RootPage() {
  redirect(`/${defaultPublicLocale}`);
}
