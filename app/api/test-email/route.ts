import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_your_api_key_here") {
      return NextResponse.json({
        error: "RESEND_API_KEY is missing or not set in .env.local",
      }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "delivered@resend.dev",
      subject: "Test email from Ledger",
      html: "<p>If you see this, Resend is working!</p>",
    });

    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
