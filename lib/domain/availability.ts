import type { AvailabilityStatus } from "@prisma/client";

const availabilityLabels: Record<"en" | "fr", Record<string, string>> = {
  en: {
    in_stock: "In stock",
    available_on_request: "Available on request",
    out_of_stock: "Out of stock",
    discontinued: "Discontinued",
  },
  fr: {
    in_stock: "En stock",
    available_on_request: "Disponible sur demande",
    out_of_stock: "Rupture de stock",
    discontinued: "Arrete",
  },
};

export function getAvailabilityLabel(
  locale: "en" | "fr",
  status: AvailabilityStatus | string,
) {
  return (
    availabilityLabels[locale][status] ??
    availabilityLabels[locale].available_on_request
  );
}
