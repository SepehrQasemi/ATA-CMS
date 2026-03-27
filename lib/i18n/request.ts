import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { defaultPublicLocale, publicLocales } from "@/lib/i18n/config";
import { getLocaleMessages } from "@/lib/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const requestedLocale = requested ?? "";
  const locale = hasLocale(publicLocales, requestedLocale)
    ? requestedLocale
    : defaultPublicLocale;

  return {
    locale,
    messages: await getLocaleMessages(locale),
  };
});
