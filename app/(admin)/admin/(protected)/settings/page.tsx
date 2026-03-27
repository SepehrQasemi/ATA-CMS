import { AdminPageHeader } from "@/components/admin/page-header";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { AdminSectionCard } from "@/components/admin/section-card";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import { appLocales } from "@/lib/i18n/config";
import { getLocaleLabel } from "@/lib/admin/utils";

import { saveSettingsAction } from "./actions";

const selectClassName =
  "focus-ring flex h-11 w-full rounded-2xl border border-line bg-white px-4 py-2 text-sm shadow-sm outline-none";

type SettingsPageProps = {
  searchParams: Promise<{ error?: string; saved?: string }>;
};

export default async function AdminSettingsPage({
  searchParams,
}: SettingsPageProps) {
  const query = await searchParams;
  const [settings, locales, imageMedia] = await Promise.all([
    prisma.siteSettings.findFirstOrThrow({
      include: { translations: true },
    }),
    prisma.locale.findMany({
      orderBy: { sortOrder: "asc" },
    }),
    prisma.media.findMany({
      where: { kind: "image" },
      orderBy: { title: "asc" },
      select: { id: true, title: true, storageKey: true },
    }),
  ]);

  const translationLookup = new Map(
    settings.translations.map((translation) => [translation.localeCode, translation]),
  );
  const localeLookup = new Map(locales.map((locale) => [locale.code, locale]));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Settings"
        title="Global site configuration"
        description="Manage public locale posture, company contact details, shared navigation, and localized site copy."
      />

      {query.error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {decodeURIComponent(query.error)}
        </div>
      ) : null}
      {query.saved ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
          Settings saved successfully.
        </div>
      ) : null}

      <form action={saveSettingsAction} className="space-y-6">
        <input type="hidden" name="id" value={settings.id} />

        <AdminSectionCard
          title="Global settings"
          description="Keep public locale and contact posture aligned with the locked MVP decisions."
        >
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label htmlFor="defaultLocaleCode">Default locale</Label>
              <select
                id="defaultLocaleCode"
                name="defaultLocaleCode"
                defaultValue={settings.defaultLocaleCode}
                className={selectClassName}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                defaultValue={settings.contactEmail}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={settings.phone ?? ""} />
            </div>
            <div>
              <Label htmlFor="defaultShareImageMediaId">Default share image</Label>
              <select
                id="defaultShareImageMediaId"
                name="defaultShareImageMediaId"
                defaultValue={settings.defaultShareImageMediaId ?? ""}
                className={selectClassName}
              >
                <option value="">No default share image</option>
                {imageMedia.map((media) => (
                  <option key={media.id} value={media.id}>
                    {media.title ?? media.storageKey}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="addressJson">Address JSON</Label>
              <Textarea
                id="addressJson"
                name="addressJson"
                defaultValue={settings.addressJson ?? "{}"}
                className="min-h-28 font-mono text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="socialLinksJson">Social links JSON</Label>
              <Textarea
                id="socialLinksJson"
                name="socialLinksJson"
                defaultValue={settings.socialLinksJson ?? "{}"}
                className="min-h-28 font-mono text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="mainNavigationJson">Main navigation JSON</Label>
              <Textarea
                id="mainNavigationJson"
                name="mainNavigationJson"
                defaultValue={settings.mainNavigationJson ?? "[]"}
                className="min-h-32 font-mono text-xs"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="footerNavigationJson">Footer navigation JSON</Label>
              <Textarea
                id="footerNavigationJson"
                name="footerNavigationJson"
                defaultValue={settings.footerNavigationJson ?? "[]"}
                className="min-h-32 font-mono text-xs"
              />
            </div>
            <div className="md:col-span-2 xl:col-span-4">
              <Label htmlFor="searchConsoleVerification">
                Search Console verification
              </Label>
              <Input
                id="searchConsoleVerification"
                name="searchConsoleVerification"
                defaultValue={settings.searchConsoleVerification ?? ""}
              />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Locale posture"
          description="English and French are the only public locales in MVP. Persian remains modeled and editable but must stay non-public."
        >
          <div className="grid gap-5 xl:grid-cols-3">
            {appLocales.map((localeCode) => {
              const locale = localeLookup.get(localeCode)!;

              return (
                <div
                  key={localeCode}
                  className="space-y-4 rounded-3xl border border-line bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{getLocaleLabel(localeCode)}</p>
                      <p className="text-sm text-muted">{localeCode.toUpperCase()}</p>
                    </div>
                    <AdminStatusBadge kind="locale" status={locale.visibilityStatus} />
                  </div>
                  <div>
                    <Label htmlFor={`label_${localeCode}`}>Label</Label>
                    <Input
                      id={`label_${localeCode}`}
                      name={`label_${localeCode}`}
                      defaultValue={locale.label}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`nativeLabel_${localeCode}`}>Native label</Label>
                    <Input
                      id={`nativeLabel_${localeCode}`}
                      name={`nativeLabel_${localeCode}`}
                      defaultValue={locale.nativeLabel ?? ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`visibilityStatus_${localeCode}`}>Visibility</Label>
                    <select
                      id={`visibilityStatus_${localeCode}`}
                      name={`visibilityStatus_${localeCode}`}
                      defaultValue={locale.visibilityStatus}
                      className={selectClassName}
                    >
                      <option value="disabled">Disabled</option>
                      <option value="internal_only">Internal only</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor={`direction_${localeCode}`}>Direction</Label>
                    <select
                      id={`direction_${localeCode}`}
                      name={`direction_${localeCode}`}
                      defaultValue={locale.direction}
                      className={selectClassName}
                    >
                      <option value="ltr">LTR</option>
                      <option value="rtl">RTL</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor={`sortOrder_${localeCode}`}>Sort order</Label>
                    <Input
                      id={`sortOrder_${localeCode}`}
                      name={`sortOrder_${localeCode}`}
                      type="number"
                      min={0}
                      defaultValue={locale.sortOrder}
                    />
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-line bg-[#fff8f8] px-4 py-3 text-sm font-semibold">
                    <input
                      type="checkbox"
                      name={`isDefaultPublic_${localeCode}`}
                      defaultChecked={locale.isDefaultPublic}
                      className="h-4 w-4 accent-[var(--brand)]"
                    />
                    Default public locale
                  </label>
                </div>
              );
            })}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Localized settings"
          description="Site-level copy stays localized just like entity content. These translations power footer, metadata defaults, and pricing fallback copy."
        >
          <LocaleTabs
            tabs={appLocales.map((localeCode) => {
              const translation = translationLookup.get(localeCode)!;

              return {
                code: localeCode,
                label: `${localeCode.toUpperCase()} · ${getLocaleLabel(localeCode)}`,
                content: (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`siteName_${localeCode}`}>Site name</Label>
                        <Input
                          id={`siteName_${localeCode}`}
                          name={`siteName_${localeCode}`}
                          defaultValue={translation.siteName}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`siteTagline_${localeCode}`}>Site tagline</Label>
                        <Input
                          id={`siteTagline_${localeCode}`}
                          name={`siteTagline_${localeCode}`}
                          defaultValue={translation.siteTagline ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`defaultMetaTitleSuffix_${localeCode}`}>
                          Meta title suffix
                        </Label>
                        <Input
                          id={`defaultMetaTitleSuffix_${localeCode}`}
                          name={`defaultMetaTitleSuffix_${localeCode}`}
                          defaultValue={translation.defaultMetaTitleSuffix ?? ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`defaultContactForPricingMessage_${localeCode}`}>
                          Default contact-for-pricing
                        </Label>
                        <Textarea
                          id={`defaultContactForPricingMessage_${localeCode}`}
                          name={`defaultContactForPricingMessage_${localeCode}`}
                          defaultValue={
                            translation.defaultContactForPricingMessage ?? ""
                          }
                          className="min-h-28"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`defaultMetaDescription_${localeCode}`}>
                          Default meta description
                        </Label>
                        <Textarea
                          id={`defaultMetaDescription_${localeCode}`}
                          name={`defaultMetaDescription_${localeCode}`}
                          defaultValue={translation.defaultMetaDescription ?? ""}
                          className="min-h-28"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`footerCompanyBlurb_${localeCode}`}>
                          Footer blurb
                        </Label>
                        <Textarea
                          id={`footerCompanyBlurb_${localeCode}`}
                          name={`footerCompanyBlurb_${localeCode}`}
                          defaultValue={translation.footerCompanyBlurb ?? ""}
                          className="min-h-28"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`contactIntro_${localeCode}`}>Contact intro</Label>
                        <Textarea
                          id={`contactIntro_${localeCode}`}
                          name={`contactIntro_${localeCode}`}
                          defaultValue={translation.contactIntro ?? ""}
                          className="min-h-28"
                        />
                      </div>
                    </div>
                  </div>
                ),
              };
            })}
          />
        </AdminSectionCard>

        <Button type="submit">Save settings</Button>
      </form>
    </div>
  );
}
