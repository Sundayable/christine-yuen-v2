import { afterEach, describe, expect, it } from "vitest";

import { siteUrl } from "../site-url";

const original = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = original;
});

describe("siteUrl", () => {
  it("falls back to the production origin, never a placeholder domain", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(siteUrl()).toBe("https://vancityhouses.com");
    expect(siteUrl()).not.toContain("example");
  });

  it("trims whitespace and trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = " https://vancityhouses.com/\n";
    expect(siteUrl()).toBe("https://vancityhouses.com");
  });

  it("falls back when the env var is blank", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "   ";
    expect(siteUrl()).toBe("https://vancityhouses.com");
  });
});
