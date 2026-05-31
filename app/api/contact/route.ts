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

  const webhookUrl = process.env.CONTACT_SHEETS_WEBHOOK_URL;
  const payload = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone: phone || "",
    message,
    // TODO: replace with actual production domain
    source: `${process.env.NEXT_PUBLIC_SITE_URL ?? "example.ca"}/contact`,
  };

  const sheetsWebhook = async () => {
    if (!webhookUrl) {
      console.log("contact submission (no webhook configured):", payload);
      return;
    }
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("contact webhook failed:", err);
    }
  };

  // Run the Sheets webhook and the Sundayable lead ingest concurrently. Both are
  // awaited (serverless can freeze after the response) but isolated via
  // allSettled so one failing never blocks the other or the visitor's success.
  await Promise.allSettled([
    sheetsWebhook(),
    sendLeadToSundayable({
      name,
      email,
      phone,
      notes: [message, `Source: ${payload.source}`].filter(Boolean).join("\n\n"),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
