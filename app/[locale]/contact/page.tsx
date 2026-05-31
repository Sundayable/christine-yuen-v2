import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import ContactForm from "@/components/ContactForm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancityhouses.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Contact Christine — Richmond, Vancouver realtor | Christine Yuen, REALTOR®",
    description:
      "Reach Christine Yuen, REALTOR® — Richmond, Vancouver East and West. Call 604-808-9918 or send a message. Most replies within a few hours.",
    alternates: { canonical: `${BASE_URL}/${locale}/contact` },
    openGraph: {
      title: "Contact Christine Yuen, REALTOR®",
      description: "Richmond, Vancouver East and West. First conversation is no commitment.",
      url: `${BASE_URL}/${locale}/contact`,
      type: "website",
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-[var(--color-canvas)]">
        <div className="container-wide max-w-4xl">
          <p
            className="text-sm tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--color-graphite)" }}
          >
            {t("contact.eyebrow")}
          </p>
          <h1
            className="text-4xl md:text-6xl font-light mb-6"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ink)" }}
          >
            {t("contact.heading")}
          </h1>
          <p
            className="text-xl"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-graphite)" }}
          >
            {t("contact.body")}
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32 bg-white border-t border-[var(--color-line)]">
        <div className="container-wide max-w-6xl pt-16">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20">
            <ContactForm />
            <aside className="space-y-10">
              <div>
                <h2
                  className="text-xs tracking-[0.2em] uppercase mb-4"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  Direct
                </h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm" style={{ color: "var(--color-graphite)" }}>Phone</dt>
                    <dd>
                      <a href="tel:+16048089918" className="text-lg hover:text-[var(--color-accent-700)]">
                        604-808-9918
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm" style={{ color: "var(--color-graphite)" }}>Email</dt>
                    <dd>
                      <a href="mailto:christine.yuen@gmail.com" className="text-lg hover:text-[var(--color-accent-700)]">
                        christine.yuen@gmail.com
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm" style={{ color: "var(--color-graphite)" }}>Instagram</dt>
                    <dd>
                      <a
                        href="https://www.instagram.com/christine.604realtor/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-lg hover:text-[var(--color-accent-700)]"
                      >
                        @christine.604realtor
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h2
                  className="text-xs tracking-[0.2em] uppercase mb-4"
                  style={{ color: "var(--color-accent-700)" }}
                >
                  Brokerage
                </h2>
                <div className="text-base space-y-1">
                  <div className="font-medium">Grand Central Realty</div>
                  <address className="not-italic" style={{ color: "var(--color-graphite)" }}>
                    230-3700 North Fraser Way<br />
                    Burnaby, BC V5J 5H4
                  </address>
                </div>
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--color-graphite)" }}>
                  {t("contact.privacy")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
