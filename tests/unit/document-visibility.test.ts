import { describe, expect, it } from "vitest";

import { getRenderablePublicDocuments } from "@/lib/public/document-visibility";

describe("getRenderablePublicDocuments", () => {
  it("keeps only documents with a public url and published localized label", () => {
    expect(
      getRenderablePublicDocuments([
        {
          id: "keep",
          isPublic: true,
          media: { publicUrl: "/documents/citric-acid-datasheet.txt", title: "Fallback" },
          translations: [
            {
              description: "Technical summary",
              label: "Datasheet",
              publishStatus: "published" as const,
            },
          ],
        },
        {
          id: "drop-draft",
          isPublic: true,
          media: { publicUrl: "/documents/draft.txt", title: "Draft" },
          translations: [
            {
              description: "Draft translation",
              label: "Draft label",
              publishStatus: "draft" as const,
            },
          ],
        },
        {
          id: "drop-label",
          isPublic: true,
          media: { publicUrl: "/documents/no-label.txt", title: "No label" },
          translations: [
            {
              description: "Missing label",
              label: "",
              publishStatus: "published" as const,
            },
          ],
        },
        {
          id: "drop-url",
          isPublic: true,
          media: { publicUrl: null, title: "No url" },
          translations: [
            {
              description: "No URL",
              label: "No URL",
              publishStatus: "published" as const,
            },
          ],
        },
      ]),
    ).toHaveLength(1);
  });
});
