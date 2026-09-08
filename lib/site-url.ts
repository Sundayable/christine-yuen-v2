const FALLBACK = "https://vancityhouses.com";

/**
 * Canonical origin for absolute URLs (sitemap, robots, metadata).
 *
 * sitemap.ts and robots.ts shipped with an `https://example.ca` placeholder,
 * so the live robots.txt advertised a sitemap on a domain we do not own and
 * every sitemap entry pointed off-site. Resolve the origin in one place and
 * normalise it so a stray newline, space or trailing slash in the env var
 * cannot reach the output.
 */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (raw && raw.length > 0 ? raw : FALLBACK).replace(/\/+$/, "");
}
