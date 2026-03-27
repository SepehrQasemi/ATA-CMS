import "@/app/globals.css";

import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { DocumentShell } from "@/components/layout/document-shell";
import { SiteFrame } from "@/components/layout/site-frame";
import {
  getLocaleDirection,
  isPublicLocale,
  publicLocales,
  type PublicLocale,
} from "@/lib/i18n/config";
import { getLocaleMessages } from "@/lib/messages";

export function generateStaticParams() {
  return publicLocales.map((locale) => ({ locale }));
}

export default async function PublicLocaleLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isPublicLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getLocaleMessages(locale);

  return (
    <DocumentShell lang={locale} dir={getLocaleDirection(locale)}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <SiteFrame locale={locale as PublicLocale}>{children}</SiteFrame>
      </NextIntlClientProvider>
    </DocumentShell>
  );
}
