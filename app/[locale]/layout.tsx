import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import WelcomeStrip from "@/components/WelcomeStrip";
import HospitalityFooter from "@/components/HospitalityFooter";
import { JsonLd } from "@/components/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancityhouses.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
    metadataBase: new URL(BASE_URL),
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/logo/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/logo/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/logo/favicon-192.png", sizes: "192x192", type: "image/png" },
      ],
      shortcut: "/logo/favicon.ico",
      apple: [{ url: "/logo/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: t("siteTitle"),
      description: t("siteDescription"),
      type: "website",
      locale: "en_CA",
      siteName: "Christine Yuen, REALTOR®",
      url: `${BASE_URL}/${locale}`,
      images: [
        {
          url: "/og/og-default.jpg",
          width: 1200,
          height: 630,
          alt: "Christine Yuen, REALTOR® — Grand Central Realty",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteTitle"),
      description: t("siteDescription"),
      images: ["/og/og-default.jpg"],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#C9A661",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const realEstateAgentSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${BASE_URL}/#christine-yuen`,
  name: "Christine Yuen",
  alternateName: "Christine Yuen, REALTOR®",
  url: BASE_URL,
  image: `${BASE_URL}/images/portrait/christine-portrait-cream.jpg`,
  telephone: "+1-604-808-9918",
  email: "christine.yuen@gmail.com",
  priceRange: "$$$",
  knowsLanguage: ["en", "zh-Hant", "zh-Hans"],
  areaServed: [
    { "@type": "City", name: "Richmond" },
    { "@type": "City", name: "Vancouver" },
    { "@type": "Place", name: "Vancouver East" },
    { "@type": "Place", name: "Vancouver West" },
  ],
  worksFor: {
    "@type": "RealEstateAgent",
    name: "Grand Central Realty",
    address: {
      "@type": "PostalAddress",
      streetAddress: "230-3700 North Fraser Way",
      addressLocality: "Burnaby",
      addressRegion: "BC",
      postalCode: "V5J 5H4",
      addressCountry: "CA",
    },
  },
  sameAs: ["https://www.instagram.com/christine.604realtor/"],
  description:
    "Christine Yuen, REALTOR® with Grand Central Realty. 26 years as a Chinese-English simultaneous interpreter and a Regulated Canadian Immigration Consultant. Serving Richmond, Vancouver East and Vancouver West.",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <>
      <NextIntlClientProvider>
        <WelcomeStrip />
        <main>{children}</main>
        <HospitalityFooter />
      </NextIntlClientProvider>
      {locale === "en" && <JsonLd schema={realEstateAgentSchema} />}
    </>
  );
}
