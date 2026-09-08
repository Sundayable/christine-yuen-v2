import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();
  // Keep in sync with app/[locale]/*/page.tsx — every entry must be a real route.
  const routes = ["", "/about", "/process", "/value", "/contact"];
  return routes.map((route) => ({
    url: `${base}/en${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
