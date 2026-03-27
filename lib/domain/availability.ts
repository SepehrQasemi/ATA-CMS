import type { AvailabilityStatus } from "@prisma/client";

const availabilityLabels = {
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
    discontinued: "Arrêté",
  },
} as const;

export function getAvailabilityLabel(
  locale: "en" | "fr",
  status: AvailabilityStatus,
) {
  return availabilityLabels[locale][status];
}
