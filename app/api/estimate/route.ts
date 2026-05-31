import { NextResponse } from "next/server";
import { sendLeadToSundayable } from "@/lib/sundayable";

// TODO: fill in PRICE_PER_SQFT with current local market $/sqft.
// Must match EstimatorForm.tsx neighborhood keys exactly.
const PRICE_PER_SQFT: Record<string, Record<string, number>> = {
  // Example format — replace with actual market data:
  "neighborhood-1": { condo: 0, townhome: 0, detached: 0 },
  "neighborhood-2": { condo: 0, townhome: 0, detached: 0 },
  "neighborhood-3": { condo: 0, townhome: 0, detached: 0 },
};

const CONDITION_MULT: Record<string, number> = {
  "move-in-ready": 1.0,
  "some-updates": 0.95,
  "major-reno": 0.85,
};

function recompute(d: Record<string, string>): { low: number; mid: number; high: number } | null {
  const base = PRICE_PER_SQFT[d.neighborhood]?.[d.propertyType];
  const sqft = parseInt(d.sqft, 10);
  if (!base || !sqft || sqft <= 0) return null;
  const yearBuilt = parseInt(d.yearBuilt, 10) || 2000;
  // TODO: update base year (2026) to current launch year
  const ageDiscount = Math.max(-0.15, (yearBuilt - 2026) * 0.005);
  const condMult = CONDITION_MULT[d.condition] ?? 1.0;
  const mid = base * sqft * (1 + ageDiscount) * condMult;
  return { low: mid * 0.92, mid, high: mid * 1.08 };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { name, email, propertyType, neighborhood, sqft, condition } = body as Record<string, string>;
  if (!name || !email || !propertyType || !neighborhood || !sqft || !condition) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const serverEstimate = recompute(body as Record<string, string>);

  // TODO: once the realtor's domain email is set up, wire a transactional email
  // send here (Brevo SDK using BREVO_API_KEY) so they get the lead in their inbox.
  const webhookUrl = process.env.ESTIMATE_SHEETS_WEBHOOK_URL ?? process.env.CONTACT_SHEETS_WEBHOOK_URL;
  const payload = {
    timestamp: new Date().toISOString(),
    // TODO: replace with actual production domain
    source: `${process.env.NEXT_PUBLIC_SITE_URL ?? "example.ca"}/value`,
    formType: "estimate",
    ...body,
    serverEstimate,
  };

  const sheetsWebhook = async () => {
    if (!webhookUrl) {
      console.log("estimate submission (no webhook configured):", payload);
      return;
    }
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("estimate webhook failed:", err);
    }
  };

  const b = body as Record<string, string>;
  const fmtRange = serverEstimate
    ? `Est. range: $${Math.round(serverEstimate.low).toLocaleString()}–$${Math.round(serverEstimate.high).toLocaleString()}`
    : "Est. range: n/a (market data not yet configured)";
  const estimateNotes = [
    "Home-value estimate request",
    `Type: ${propertyType} · Neighborhood: ${neighborhood}`,
    b.address ? `Address: ${b.address}` : null,
    `Beds/Baths: ${b.beds || "—"}/${b.baths || "—"} · SqFt: ${sqft} · Year: ${b.yearBuilt || "—"}`,
    `Condition: ${condition} · Reason: ${b.reason || "—"}`,
    fmtRange,
    `Source: ${payload.source}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Sheets webhook + Sundayable ingest run concurrently; allSettled isolates
  // failures so neither blocks the other or the visitor's optimistic success.
  await Promise.allSettled([
    sheetsWebhook(),
    sendLeadToSundayable({ name, email, phone: b.phone, notes: estimateNotes }),
  ]);

  return NextResponse.json({ ok: true, estimate: serverEstimate });
}
