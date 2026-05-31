import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import EstimatorForm from "@/components/EstimatorForm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancityhouses.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Home Value — Richmond, Vancouver East & West | Christine Yuen, REALTOR®",
    description:
      "Free home value estimate based on Richmond, Vancouver East and West comparables. Personal review from Christine Yuen, REALTOR®, within 24 hours.",
    alternates: { canonical: `${BASE_URL}/${locale}/value` },
    openGraph: {
      title: "What's your home worth? — Christine Yuen, REALTOR®",
      description: "Personal review from Christine within 24 hours. No bots, no auto-estimates.",
      url: `${BASE_URL}/${locale}/value`,
      type: "website",
    },
  };
}

export default async function ValuePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-3xl">
          <p
            className="text-sm tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--color-graphite)" }}
          >
            Home value
          </p>
          <h1
            className="text-4xl md:text-6xl font-light mb-6"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            What's your home worth?
          </h1>
          <p className="text-lg md:text-xl" style={{ color: "var(--color-graphite)" }}>
            A personal estimate from Christine, based on Richmond and Vancouver comparables and current market activity. She'll email you within 24 hours.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-canvas)]">
        <div className="relative w-full aspect-[16/7] md:aspect-[16/6] max-h-[420px] overflow-hidden">
          <Image
            src="/images/atmosphere/atlas-hero.jpg"
            alt="Lower Mainland coastline at dusk"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-white border-t border-[var(--color-line)]">
        <div className="container-wide max-w-3xl pt-16">
          <EstimatorForm />
        </div>
      </section>
    </>
  );
}
