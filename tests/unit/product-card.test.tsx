import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { ProductCard } from "@/components/site/product-card";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    fill,
    ...props
  }: {
    alt: string;
    fill?: boolean;
    src: string;
  }) => {
    void fill;
    return <span data-alt={alt} data-src={src} {...props} />;
  },
}));

describe("ProductCard", () => {
  test("renders a link when the product slug is available", () => {
    render(
      <ProductCard
        availabilityStatus="in_stock"
        imageUrl="/catalog/citric-acid-monohydrate.svg"
        locale="en"
        manufacturerName="Meridian Bio"
        name="Citric Acid Monohydrate"
        priceLabel="$21.50 / kg"
        shortDescription="Food-grade acidity regulator."
        slug="citric-acid-monohydrate"
      />,
    );

    expect(
      screen.getByRole("link", { name: /citric acid monohydrate/i }),
    ).toHaveAttribute("href", "/en/products/citric-acid-monohydrate");
  });

  test("degrades gracefully when slug, media, and descriptions are incomplete", () => {
    render(
      <ProductCard
        availabilityStatus="available_on_request"
        imageUrl="javascript:alert(1)"
        locale="en"
        manufacturerName="   "
        name="Industrial Buffer"
        priceLabel=""
        shortDescription="   "
        slug="   "
      />,
    );

    expect(screen.queryByRole("link", { name: /industrial buffer/i })).toBeNull();
    expect(screen.getByText(/product visual pending/i)).toBeVisible();
    expect(screen.getByText(/catalog team/i)).toBeVisible();
    expect(screen.getByText(/ATA catalog/i)).toBeVisible();
  });
});
