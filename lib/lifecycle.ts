import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "PaperLens <noreply@iammara.com>";
const REPLY_TO = process.env.RESEND_REPLY_TO ?? "support@iammara.com";

export type LifecycleStage = "day0" | "day1" | "day3" | "day7" | "day14" | "day30" | "day60_winback";

let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (_resend) return _resend;
  _resend = new Resend(key);
  return _resend;
}

const SUBJECTS: Record<LifecycleStage, string> = {
  day0: "You're in. Here's how to get the most from PaperLens.",
  day1: "Most people miss this clause type",
  day3: "312 dollars",
  day7: "1 free scan left",
  day14: "That document you keep putting off",
  day30: "One month with PaperLens",
  day60_winback: "A new doc type might help",
};

const BODIES: Record<LifecycleStage, string> = {
  day0: [
    "Welcome.",
    "",
    "The fastest way to see what PaperLens does: upload the next document",
    "sitting on your desk. A lease, an insurance letter, the medical bill",
    "you keep meaning to read.",
    "",
    "You'll get the plain-language summary in ~10 seconds, with the risky",
    "parts highlighted. Free for your first 3 documents.",
    "",
    "Reply if anything breaks — we read every reply and respond fast.",
    "",
    "— PaperLens",
  ].join("\n"),
  day1: [
    "A pattern from the first 1,000 documents people ran through PaperLens:",
    "auto-renewal clauses are the single most-missed item.",
    "",
    "If you have a gym, software subscription, or insurance policy on file,",
    "run it through PaperLens today. The renewal date is usually buried.",
    "",
    "https://printer-olive.vercel.app/upload",
  ].join("\n"),
  day3: [
    "That's the average savings PaperLens users find on their first medical",
    "bill scan. Duplicate charges, billing-code errors, services not covered.",
    "",
    "Got a bill from this year? Worth ten seconds.",
    "",
    "https://printer-olive.vercel.app/upload",
  ].join("\n"),
  day7: [
    "You've used 2 of your 3 free scans this month.",
    "",
    "Pro is $6.99/month. Cancel anytime. The first month pays for itself if",
    "PaperLens catches one error on a single document.",
    "",
    "https://printer-olive.vercel.app/pricing",
  ].join("\n"),
  day14: [
    "The reason people don't read contracts is they don't have time.",
    "PaperLens takes ten seconds.",
    "",
    "The lease renewal, the new job offer, the parents' insurance — pick one.",
    "",
    "https://printer-olive.vercel.app/upload",
  ].join("\n"),
  day30: [
    "Quick favor: if PaperLens has saved you time or money, send this link",
    "to one friend who moves apartments a lot, freelances, or just got a",
    "confusing letter.",
    "",
    "https://printer-olive.vercel.app",
  ].join("\n"),
  day60_winback: [
    "Since you last scanned, PaperLens added new document types and",
    "language coverage. If you've got a lease, contract, or bill sitting",
    "around, it's a quick test.",
    "",
    "https://printer-olive.vercel.app/upload",
  ].join("\n"),
};

export async function sendLifecycle(to: string, stage: LifecycleStage): Promise<boolean> {
  const r = getResend();
  if (!r) return false;
  try {
    await r.emails.send({
      from: FROM,
      to,
      subject: SUBJECTS[stage],
      text: BODIES[stage],
      replyTo: REPLY_TO,
    });
    return true;
  } catch {
    return false;
  }
}

// Stage to send for an account that signed up `daysSinceSignup` days ago
// and has `daysSinceLastAnalysis` days since their last analysis (or null
// if never analyzed). Returns null if no email is due today.
export function pickStage(
  daysSinceSignup: number,
  daysSinceLastAnalysis: number | null,
): LifecycleStage | null {
  // Map signup-age to a single-shot stage.
  if (daysSinceSignup === 0) return "day0";
  if (daysSinceSignup === 1) return "day1";
  if (daysSinceSignup === 3) return "day3";
  if (daysSinceSignup === 7) return "day7";
  if (daysSinceSignup === 14) return "day14";
  if (daysSinceSignup === 30) return "day30";
  // Win-back: ≥60 days from signup AND ≥30 days inactive (or never).
  if (daysSinceSignup >= 60 && (daysSinceLastAnalysis === null || daysSinceLastAnalysis >= 30)) {
    return "day60_winback";
  }
  return null;
}
