import { describe, it, expect } from "vitest";
import { analyzeWithFallback } from "@/lib/ai/router";
import { ProviderError, type AnalyzeOutput } from "@/lib/ai/types";
import type { Provider } from "@/lib/ai/Provider";

const okOutput: AnalyzeOutput = {
  analysis: {
    document_type: "lease",
    summary: "ok",
    risks: [],
    questions: [],
    key_terms: [],
    confidence: 0.9,
  },
  modelUsed: "stub",
  provider: "gemini",
  inputTokens: 0,
  outputTokens: 0,
  costUsd: 0,
  durationMs: 1,
};

function stubProvider(name: "gemini" | "huggingface", impl: () => Promise<AnalyzeOutput>): Provider {
  return { name, analyze: impl };
}

const input = { fileBytes: new Uint8Array(), mimeType: "image/png", outputLocale: "en" };

describe("analyzeWithFallback", () => {
  it("returns the first provider's result when it succeeds", async () => {
    const out = await analyzeWithFallback(input, [
      stubProvider("gemini", async () => ({ ...okOutput, modelUsed: "first" })),
      stubProvider("huggingface", async () => {
        throw new Error("should not be called");
      }),
    ]);
    expect(out.modelUsed).toBe("first");
  });

  it("falls back to next provider on retryable error", async () => {
    const out = await analyzeWithFallback(input, [
      stubProvider("gemini", async () => {
        throw new ProviderError("gemini", true, "429 RESOURCE_EXHAUSTED");
      }),
      stubProvider("huggingface", async () => ({ ...okOutput, modelUsed: "second" })),
    ]);
    expect(out.modelUsed).toBe("second");
  });

  it("falls back when message looks like a quota / availability issue", async () => {
    const out = await analyzeWithFallback(input, [
      stubProvider("gemini", async () => {
        throw new ProviderError("gemini", false, "quota exceeded");
      }),
      stubProvider("huggingface", async () => ({ ...okOutput, modelUsed: "second" })),
    ]);
    expect(out.modelUsed).toBe("second");
  });

  it("does NOT fall back on non-retryable, non-quota errors", async () => {
    await expect(
      analyzeWithFallback(input, [
        stubProvider("gemini", async () => {
          throw new ProviderError("gemini", false, "malformed JSON");
        }),
        stubProvider("huggingface", async () => ({ ...okOutput, modelUsed: "should-not-reach" })),
      ]),
    ).rejects.toThrow(/malformed/);
  });

  it("throws when all providers fail", async () => {
    await expect(
      analyzeWithFallback(input, [
        stubProvider("gemini", async () => {
          throw new ProviderError("gemini", true, "503");
        }),
        stubProvider("huggingface", async () => {
          throw new ProviderError("huggingface", true, "504");
        }),
      ]),
    ).rejects.toThrow(/all providers failed/);
  });
});
