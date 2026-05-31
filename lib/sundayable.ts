// Server-only helper: push captured leads into Sundayable via the external
// lead-ingest API. Never import this from a client component — the API key
// must stay on the server (it is read from process.env, set in Vercel).

const SUNDAYABLE_ENDPOINT = "https://api.sundayable.com/api/external/leads";

// Ownership: leads ingested here belong to this rep. This is an account
// identifier, not a secret, so a code default is fine; override via env if needed.
const REP_USER_ID =
  process.env.SUNDAYABLE_REP_USER_ID ?? "b90428d8-2caf-4d34-be89-24b115d2f3d3";

export type SundayableResult =
  | { ok: true; status: number }
  | { ok: false; skipped: "no-api-key" | "no-phone" }
  | { ok: false; status?: number };

/**
 * Normalize a raw phone string to E.164. Defaults to Canada (+1), which fits
 * this BC site. Returns null when the input can't be coerced to a valid number.
 */
export function toE164(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (/^\+[1-9]\d{7,14}$/.test(trimmed)) return trimmed; // already E.164
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`; // assume CC included
  return null;
}

/**
 * Send one lead to Sundayable. Phone is required (per the ingest API); email is
 * optional. Failures are logged and swallowed — lead ingest must never break the
 * visitor's form submission (the Sheets webhook is the primary record of truth).
 */
export async function sendLeadToSundayable(input: {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}): Promise<SundayableResult> {
  const apiKey = process.env.SUNDAYABLE_LEAD_API_KEY;
  if (!apiKey) {
    console.warn("[sundayable] SUNDAYABLE_LEAD_API_KEY not set — skipping lead ingest");
    return { ok: false, skipped: "no-api-key" };
  }

  const phone = toE164(input.phone);
  if (!phone) {
    console.warn("[sundayable] missing/invalid phone — skipping (phone is required)");
    return { ok: false, skipped: "no-phone" };
  }

  const body: Record<string, string> = {
    repUserId: REP_USER_ID,
    name: input.name?.trim() ?? "",
    phone,
    notes: input.notes?.trim() ?? "",
  };
  const email = input.email?.trim();
  if (email) body.email = email; // optional

  try {
    const res = await fetch(SUNDAYABLE_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[sundayable] ingest failed ${res.status}: ${text.slice(0, 300)}`);
      return { ok: false, status: res.status };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    console.error("[sundayable] ingest error:", err);
    return { ok: false };
  }
}
