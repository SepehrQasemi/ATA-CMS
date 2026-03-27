import { siteConfig } from "@/lib/site-config";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function buildAbsoluteUrl(pathname: string) {
  return new URL(pathname, getSiteUrl()).toString();
}

export function getDefaultMetaTitle(title: string) {
  return `${title} | ${siteConfig.companyName}`;
}
