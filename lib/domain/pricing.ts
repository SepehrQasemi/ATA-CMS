export type PricingInput = {
  amount: number | null | undefined;
  currency: string | null | undefined;
  locale: string;
  message: string | null | undefined;
  unitLabel: string | null | undefined;
};

export function hasPublicPrice(amount: number | null | undefined) {
  return typeof amount === "number";
}

export function resolvePricingMessage(input: PricingInput) {
  if (hasPublicPrice(input.amount) && input.currency) {
    const formatter = new Intl.NumberFormat(input.locale, {
      style: "currency",
      currency: input.currency,
      maximumFractionDigits: 2,
    });

    const formatted = formatter.format(input.amount);
    return input.unitLabel ? `${formatted} / ${input.unitLabel}` : formatted;
  }

  return input.message ?? "";
}

export function hasPricingFallback(input: PricingInput) {
  return hasPublicPrice(input.amount) || Boolean(input.message?.trim());
}
