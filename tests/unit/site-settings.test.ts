import { describe, expect, it } from "vitest";

import {
  formatSiteAddressLines,
  parseSiteNavigation,
  parseSocialLinks,
} from "@/lib/site-settings";

describe("site settings helpers", () => {
  it("formats address lines from stored json", () => {
    expect(
      formatSiteAddressLines(
        JSON.stringify({
          city: "Paris",
          country: "France",
          line1: "Rue du Commerce",
          postalCode: "75015",
        }),
      ),
    ).toEqual(["Rue du Commerce", "75015 Paris", "France"]);
  });

  it("fails safely on invalid json", () => {
    expect(formatSiteAddressLines("{invalid")).toEqual([]);
    expect(parseSiteNavigation("{invalid")).toEqual([]);
    expect(parseSocialLinks("{invalid")).toEqual([]);
  });

  it("normalizes social links", () => {
    expect(
      parseSocialLinks(
        JSON.stringify({
          linkedin: "https://www.linkedin.com/company/abadis-tejarat-arka",
        }),
      ),
    ).toEqual([
      {
        href: "https://www.linkedin.com/company/abadis-tejarat-arka",
        label: "LinkedIn",
      },
    ]);
  });
});
