import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Ledger <onboarding@resend.dev>",
    to: email,
    subject: "Verify your Ledger account",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background:#080812;font-family:'Helvetica Neue',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#080812;padding:40px 20px;">
            <tr><td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background:linear-gradient(145deg,#0f0f1a,#161628);border:1px solid rgba(212,168,83,0.2);border-radius:20px;overflow:hidden;">
                <tr><td style="height:2px;background:linear-gradient(90deg,transparent,#D4A853,transparent);"></td></tr>
                <tr><td style="padding:40px 40px 32px;">
                  <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                    <tr>
                      <td style="background:linear-gradient(135deg,#D4A853,#B8864A);border-radius:8px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                        <span style="color:#0f0f1a;font-size:16px;font-weight:900;">L</span>
                      </td>
                      <td style="padding-left:10px;font-size:18px;color:#f0e8d8;letter-spacing:0.06em;font-family:Georgia,serif;">LEDGER</td>
                    </tr>
                  </table>
                  <h1 style="font-family:Georgia,serif;font-size:28px;color:#f0e8d8;font-weight:400;margin:0 0 12px;">Verify your email</h1>
                  <p style="color:#888;font-size:14px;line-height:1.6;margin:0 0 32px;">Hi ${name}, welcome to Ledger. Click the button below to verify your email and activate your account.</p>
                  <a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#D4A853,#B8864A);color:#0f0f1a;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.06em;padding:14px 32px;border-radius:10px;margin-bottom:32px;">
                    VERIFY EMAIL ADDRESS
                  </a>
                  <p style="color:#555;font-size:12px;margin:0 0 8px;">Or copy this link into your browser:</p>
                  <p style="color:#D4A853;font-size:11px;word-break:break-all;margin:0 0 32px;">${verifyUrl}</p>
                  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:0 0 24px;">
                  <p style="color:#444;font-size:12px;margin:0;">This link expires in 24 hours. If you didn't create a Ledger account, ignore this email.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log("Verification email sent:", data);
  return data;
}
