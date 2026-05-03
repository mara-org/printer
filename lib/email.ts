import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (_resend) return _resend;
  _resend = new Resend(key);
  return _resend;
}

const FROM = process.env.RESEND_FROM ?? "PaperLens <onboarding@resend.dev>";

export async function sendWelcomeEmail(to: string): Promise<void> {
  const r = getResend();
  if (!r) return;
  const subject = "You're in. Here's how to get the most from PaperLens.";
  const text = [
    `Welcome.`,
    ``,
    `The fastest way to see what PaperLens does: upload the next document`,
    `sitting on your desk. A lease, an insurance letter, the medical bill`,
    `you keep meaning to read.`,
    ``,
    `You'll get the plain-language summary in ~10 seconds, with the risky`,
    `parts highlighted. Free for your first 3 documents.`,
    ``,
    `Reply if anything breaks — we read every reply and respond fast.`,
    ``,
    `— PaperLens`,
  ].join("\n");
  try {
    await r.emails.send({ from: FROM, to, subject, text });
  } catch {
    // best-effort; signup succeeds even if email fails
  }
}
