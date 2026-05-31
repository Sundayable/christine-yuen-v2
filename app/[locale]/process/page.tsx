import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancityhouses.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Process — How I work | Christine Yuen, REALTOR®",
    description:
      "From first conversation to keys in hand. Christine Yuen's four-step process for Richmond, Vancouver East and West buyers and sellers.",
    alternates: { canonical: `${BASE_URL}/${locale}/process` },
    openGraph: {
      title: "How I work — Christine Yuen, REALTOR®",
      description: "From hello to keys, in four steps.",
      url: `${BASE_URL}/${locale}/process`,
      type: "article",
    },
  };
}

export default async function ProcessPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const tiles = t.raw("howIWork.tiles") as { number: string; title: string; body: string }[];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tiles.map((tile) => ({
      "@type": "Question",
      name: tile.title,
      acceptedAnswer: { "@type": "Answer", text: tile.body },
    })),
  });

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-4xl">
          <p
            className="text-sm tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--color-graphite)" }}
          >
            How I work
          </p>
          <h1
            className="text-4xl md:text-6xl font-light mb-8"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            From hello to keys.
          </h1>
          <p className="text-lg md:text-xl max-w-2xl" style={{ color: "var(--color-graphite)" }}>
            Four steps. No surprises, no jargon. Built around the conversation, not the clock.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-4xl">
          <ol className="space-y-px bg-[var(--color-line)] border border-[var(--color-line)]">
            {tiles.map((tile) => (
              <li key={tile.number} className="bg-white p-8 md:p-12 grid md:grid-cols-[120px_1fr] gap-6 md:gap-12">
                <div>
                  <p
                    className="text-sm tracking-[0.2em] uppercase"
                    style={{ color: "var(--color-accent-700)" }}
                  >
                    Step {tile.number}
                  </p>
                </div>
                <div>
                  <h2
                    className="text-2xl md:text-3xl font-light mb-3"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
                  >
                    {tile.title}
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--color-graphite)" }}>
                    {tile.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white border-t border-[var(--color-line)]">
        <div className="relative w-full aspect-[16/7] md:aspect-[16/6] max-h-[420px] overflow-hidden">
          <Image
            src="/images/atmosphere/process-interlude.jpg"
            alt="Editorial flatlay — leather portfolio, fountain pen, jasmine tea"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-wide max-w-3xl text-center">
          <p
            className="text-2xl md:text-3xl font-light mb-8"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            Ready when you are.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white tracking-wide hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            Start a conversation
          </Link>
        </div>
      </section>

      {locale === "en" && <JsonLd schema={faqSchema} />}
    </>
  );
}
