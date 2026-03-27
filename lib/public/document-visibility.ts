import type { PublishStatus } from "@prisma/client";

type PublicDocumentTranslation = {
  description?: string | null;
  label?: string | null;
  publishStatus?: PublishStatus;
};

type PublicDocumentInput<TDocument> = TDocument & {
  isPublic: boolean;
  media: {
    publicUrl?: string | null;
    title?: string | null;
  };
  translations: PublicDocumentTranslation[];
};

export function getRenderablePublicDocuments<TDocument extends object>(
  documents: Array<PublicDocumentInput<TDocument>>,
) {
  return documents.flatMap((document) => {
    if (!document.isPublic || !document.media.publicUrl) {
      return [];
    }

    const translation =
      document.translations.find((item: PublicDocumentTranslation) => {
        const isPublished =
          item.publishStatus === undefined || item.publishStatus === "published";

        return isPublished && Boolean(item.label?.trim());
      }) ?? null;

    if (!translation) {
      return [];
    }

    return [
      {
        ...document,
        translation,
      },
    ];
  });
}
