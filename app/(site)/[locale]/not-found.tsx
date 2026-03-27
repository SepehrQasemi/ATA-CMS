"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LocaleNotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "fr" ? "fr" : "en";

  const copy =
    locale === "fr"
      ? {
          body: "Le contenu demande n est pas public, n existe plus, ou n est pas disponible dans cette langue.",
          heading: "Contenu introuvable",
          home: "Retour a l accueil",
          products: "Voir les produits",
        }
      : {
          body: "The requested content is not public, no longer exists, or is not available in this locale.",
          heading: "Content not found",
          home: "Back to home",
          products: "Browse products",
        };

  return (
    <section className="section-shell">
      <div className="content-shell">
        <Card className="mx-auto max-w-3xl space-y-5 px-8 py-10 text-center">
          <p className="eyebrow">404</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">
            {copy.heading}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-muted">
            {copy.body}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href={`/${locale}`}>{copy.home}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/${locale}/products`}>{copy.products}</Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
