import { NextResponse } from "next/server";
import { sendLeadToSundayable } from "@/lib/sundayable";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { name, email, phone, message } = body as Record<string, string>;
  if (!name || !phone || !message) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const source = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vancityhouses.com"}/contact`;
  const notes = [message, `Source: ${source}`].filter(Boolean).join("\n\n");

  // Primary destination is Sundayable (the CRM). The Google Sheets webhook is
  // optional/legacy — only attempted when CONTACT_SHEETS_WEBHOOK_URL is set, and
  // never blocks the Sundayable ingest. Both awaited so serverless doesn't freeze.
  const tasks: Promise<unknown>[] = [sendLeadToSundayable({ name, email, phone, notes })];

  const webhookUrl = process.env.CONTACT_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    const payload = { timestamp: new Date().toISOString(), name, email, phone, message, source };
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("contact webhook failed:", err)),
    );
  }

  await Promise.allSettled(tasks);
  return NextResponse.json({ ok: true });
}
