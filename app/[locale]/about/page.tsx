import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
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
    title: "About Christine Yuen — REALTOR® with Grand Central Realty",
    description:
      "26 years as a Chinese-English simultaneous interpreter and a Regulated Canadian Immigration Consultant. Christine Yuen helps families and investors across Richmond, Vancouver East and West.",
    alternates: { canonical: `${BASE_URL}/${locale}/about` },
    openGraph: {
      title: "About Christine Yuen — REALTOR® with Grand Central Realty",
      description:
        "26 years as a Chinese-English simultaneous interpreter and a Regulated Canadian Immigration Consultant.",
      url: `${BASE_URL}/${locale}/about`,
      type: "profile",
      images: [
        {
          url: "/images/portrait/christine-arms-crossed.jpg",
          width: 1024,
          height: 1536,
          alt: "Christine Yuen, REALTOR®",
        },
      ],
    },
  };
}

const personSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Christine Yuen",
  jobTitle: "REALTOR®, Real Estate Consultant",
  worksFor: {
    "@type": "Organization",
    name: "Grand Central Realty",
  },
  knowsLanguage: ["en", "zh-Hant", "zh-Hans"],
  url: `${BASE_URL}/en/about`,
  image: `${BASE_URL}/images/portrait/christine-arms-crossed.jpg`,
  sameAs: ["https://www.instagram.com/christine.604realtor/"],
});

const bento = [
  {
    span: "md:col-span-2 md:row-span-2",
    eyebrow: "PORTRAIT",
    body: null,
    image: "/images/portrait/christine-arms-crossed.jpg",
  },
  {
    span: "md:col-span-2",
    eyebrow: "26 YEARS LISTENING",
    title: "Interpreter, then realtor.",
    body: "I spent 26 years as a Chinese-English simultaneous interpreter — boardrooms, market research, contracts. The job teaches you to listen for the thing under the thing.",
  },
  {
    span: "",
    eyebrow: "LICENSE",
    title: "RCIC",
    body: "Regulated Canadian Immigration Consultant. Newcomer buyers move through the system without surprises.",
  },
  {
    span: "",
    eyebrow: "LANGUAGES",
    title: "EN · 廣東話 · 普通話",
    body: "Cantonese fluent. Mandarin where it helps. English on the page.",
  },
  {
    span: "md:col-span-2",
    eyebrow: "BROKERAGE",
    title: "Grand Central Realty",
    body: "Personal Real Estate Corporation. BCFSA RE611159. 230-3700 North Fraser Way, Burnaby BC.",
  },
  {
    span: "md:col-span-2",
    eyebrow: "BELIEF",
    title: "Buying a home should feel like a conversation, not a negotiation against a clock.",
    body: null,
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-5xl">
          <p
            className="text-sm tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--color-graphite)" }}
          >
            About
          </p>
          <h1
            className="text-4xl md:text-6xl font-light mb-6"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            Christine Yuen
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl" style={{ color: "var(--color-graphite)" }}>
            REALTOR® with Grand Central Realty. Serving Richmond, Vancouver East and West.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {bento.map((card, i) => (
              <article
                key={i}
                className={`${card.span} bg-white border border-[var(--color-line)] ${card.image ? "p-0 relative min-h-[420px] md:min-h-0" : "p-8 flex flex-col"}`}
              >
                {card.image ? (
                  <Image
                    src={card.image}
                    alt="Christine Yuen, REALTOR®"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: "center 25%" }}
                    priority
                  />
                ) : (
                  <>
                    <p
                      className="text-xs tracking-[0.2em] uppercase"
                      style={{ color: "var(--color-accent-700)" }}
                    >
                      {card.eyebrow}
                    </p>
                    {card.title && (
                      <h2
                        className="text-2xl md:text-3xl font-light mt-4"
                        style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
                      >
                        {card.title}
                      </h2>
                    )}
                    {card.body && (
                      <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--color-graphite)" }}>
                        {card.body}
                      </p>
                    )}
                  </>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-[var(--color-line)]">
        <div className="container-wide max-w-3xl text-center">
          <p
            className="text-2xl md:text-3xl font-light mb-8"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            Let's talk about your move.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-[var(--color-accent)] text-white tracking-wide hover:bg-[var(--color-accent-dark)] transition-colors"
          >
            Schedule a chat
          </Link>
        </div>
      </section>

      {locale === "en" && <JsonLd schema={personSchema} />}
    </>
  );
}
