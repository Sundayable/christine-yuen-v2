import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import WelcomeHero from "@/components/sections/WelcomeHero";
import HowIWork from "@/components/sections/HowIWork";
import Testimonials from "@/components/sections/Testimonials";
import CurrentlyRepresenting from "@/components/sections/CurrentlyRepresenting";
import AboutSnippet from "@/components/sections/AboutSnippet";
import Atlas from "@/components/sections/Atlas";
import ContactStrip from "@/components/sections/ContactStrip";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancityhouses.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("siteTitle"),
    description: t("siteDescription"),
    alternates: { canonical: `${BASE_URL}/${locale}` },
    openGraph: {
      title: t("siteTitle"),
      description: t("siteDescription"),
      url: `${BASE_URL}/${locale}`,
      type: "website",
      images: [{ url: "/og/og-default.jpg", width: 1200, height: 630, alt: "Christine Yuen, REALTOR®" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteTitle"),
      description: t("siteDescription"),
      images: ["/og/og-default.jpg"],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <WelcomeHero />
      <HowIWork />
      <Testimonials />
      <CurrentlyRepresenting />
      <AboutSnippet />
      <Atlas />
      <ContactStrip />
    </>
  );
}
