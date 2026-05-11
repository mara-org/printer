#!/usr/bin/env node
// Generate distribution drafts for the day:
//   - 5 Reddit reply drafts (value-first; flags the subreddit + the kind of
//     thread to look for)
//   - 1 X (Twitter) thread (5–7 tweets, ≤270 chars each, no hashtag spam)
//
// Output: marketing/drafts/<YYYY-MM-DD>.json
//
// Designed to run on a GitHub Actions runner with GEMINI_API_KEY in env.
// Always exits 0 (best effort). The caller is expected to open a PR with the
// generated file so the founder can approve and post.
//
// We do NOT auto-post. Reddit + X policies disqualify clearly-bot accounts;
// human review is the safety valve.
//
// Usage:
//   GEMINI_API_KEY=... node scripts/marketing-draft.mjs

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DRAFTS_DIR = path.join(process.cwd(), "marketing", "drafts");

const SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    reddit_replies: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          subreddit: { type: SchemaType.STRING },
          thread_intent: { type: SchemaType.STRING },
          reply_body: { type: SchemaType.STRING },
        },
        required: ["subreddit", "thread_intent", "reply_body"],
      },
    },
    x_thread: {
      type: SchemaType.OBJECT,
      properties: {
        topic: { type: SchemaType.STRING },
        tweets: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
        },
      },
      required: ["topic", "tweets"],
    },
  },
  required: ["reddit_replies", "x_thread"],
};

const SUBREDDITS = [
  "r/personalfinance",
  "r/legaladvice",
  "r/insurance",
  "r/AskALawyer",
  "r/Renters",
  "r/Landlord",
  "r/immigration",
  "r/medicalbill",
  "r/povertyfinance",
  "r/Frugal",
  "r/Insurance",
  "r/firstjob",
  "r/freelance",
];

const SYSTEM = [
  "You draft distribution copy for PaperLens — an AI document explainer that",
  "reads everyday official documents (leases, contracts, insurance, medical",
  "bills, tax letters) and explains them in plain language with risks and",
  "questions to ask.",
  "",
  "Rules for EVERY output:",
  "- Value-first. Never lead with the product. The reader's problem comes",
  "  first; PaperLens is mentioned only when it is the cheapest solution to",
  "  what was just explained, and even then only once per piece.",
  "- No marketing voice. No 'game-changer', no 'revolutionize', no emoji.",
  "- Plain spoken English. The kind of comment a knowledgeable friend writes.",
  "- No legal advice. Describe what documents typically say and what to ask.",
  "- No fabricated stats. If a number appears, it must be plausibly true and",
  "  scoped ('most leases', 'often', 'in many states') — never a hard claim.",
  "",
  "Reddit replies:",
  "- Pick 5 distinct subreddits where document-confusion threads recur.",
  `  Reasonable choices: ${SUBREDDITS.join(", ")}.`,
  "- thread_intent is the kind of post the reply targets, e.g. 'OP shares a",
  "  confusing auto-renewal clause from their gym contract'.",
  "- reply_body: 80–180 words. Address the specific scenario; give 2–3 things",
  "  the OP can actually do. End with at most ONE sentence mentioning that",
  "  pasting the document into PaperLens summarizes it free for the first 3.",
  "- Never include the URL in every reply — only in 2 of the 5.",
  "",
  "X thread:",
  "- One thread per day. 5–7 tweets. Each tweet ≤ 270 chars.",
  "- Topic is one document type or one specific clause/risk people miss.",
  "- Open with the hook (concrete pain). Middle is 3–5 concrete steps or",
  "  examples. Close mentions PaperLens once, with the URL.",
  "- No hashtags. No 'thread 🧵'. No 'follow for more'.",
].join("\n");

async function main() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("GEMINI_API_KEY not set; skipping");
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  const outPath = path.join(DRAFTS_DIR, `${today}.json`);
  if (fs.existsSync(outPath)) {
    console.log(`drafts already exist for ${today}; skipping`);
    return;
  }

  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCHEMA,
      temperature: 0.6,
    },
  });

  const prompt = [
    `Today is ${today}. Generate today's distribution drafts.`,
    "Pick a fresh angle from yesterday: rotate document types and subreddits.",
    "Return JSON only.",
  ].join(" ");

  let json;
  try {
    const result = await model.generateContent([{ text: prompt }]);
    json = JSON.parse(result.response.text());
  } catch (err) {
    console.error("generation failed:", err?.message ?? err);
    return;
  }

  // Guardrails: trim X tweets to 270 chars, cap counts.
  if (json.x_thread?.tweets) {
    json.x_thread.tweets = json.x_thread.tweets
      .slice(0, 7)
      .map((t) => (typeof t === "string" ? t.slice(0, 270) : ""))
      .filter(Boolean);
  }
  if (Array.isArray(json.reddit_replies)) {
    json.reddit_replies = json.reddit_replies.slice(0, 5);
  }

  json.generated_at = new Date().toISOString();
  json.generated_by = "gemini-2.5-flash";

  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(json, null, 2));
  console.log(`wrote ${outPath}`);
}

main().catch((err) => {
  console.error("marketing-draft fatal:", err);
  process.exit(0);
});
