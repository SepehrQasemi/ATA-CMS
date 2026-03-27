export type PricingInput = {
  amount: number | null | undefined;
  currency: string | null | undefined;
  locale: string;
  message: string | null | undefined;
  unitLabel: string | null | undefined;
};

function isSupportedCurrencyCode(value: string) {
  const normalized = value.trim().toUpperCase();

  if (!normalized || normalized.length !== 3) {
    return false;
  }

  if (typeof Intl.supportedValuesOf !== "function") {
    return true;
  }

  return Intl.supportedValuesOf("currency").includes(normalized);
}

export function hasPublicPrice(
  amount: number | null | undefined,
): amount is number {
  return typeof amount === "number" && Number.isFinite(amount);
}

export function resolvePricingMessage(input: PricingInput) {
  const amount = input.amount;

  if (hasPublicPrice(amount) && input.currency && isSupportedCurrencyCode(input.currency)) {
    try {
      const formatter = new Intl.NumberFormat(input.locale, {
        style: "currency",
        currency: input.currency.trim().toUpperCase(),
        maximumFractionDigits: 2,
      });

      const formatted = formatter.format(amount);
      return input.unitLabel ? `${formatted} / ${input.unitLabel}` : formatted;
    } catch {
      // Invalid currency codes should degrade to the inquiry fallback.
    }
  }

  if (typeof input.message === "string" && input.message.trim().length > 0) {
    return input.message.trim();
  }

  return input.locale === "fr"
    ? "Contactez ATA pour le prix."
    : "Contact ATA for pricing.";
}

export function hasPricingFallback(input: PricingInput) {
  return hasPublicPrice(input.amount) || Boolean(input.message?.trim());
}
