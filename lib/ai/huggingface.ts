import { InferenceClient } from "@huggingface/inference";
import { AnalysisSchema, ProviderError } from "./types";
import type { AnalyzeInput, AnalyzeOutput } from "./types";
import type { Provider } from "./Provider";
import { systemPrompt, ANALYSIS_JSON_SHAPE } from "./prompts";
import { estimateCostUsd } from "./cost";

// Llama-3.2-Vision is widely available on HF Inference Providers and
// supports image input + JSON output via prompt instruction.
const HF_MODEL = "meta-llama/Llama-3.2-11B-Vision-Instruct";
const COST_KEY = "hf-llama-3.2-vision";

function getClient(): InferenceClient {
  const token = process.env.HUGGINGFACE_TOKEN;
  if (!token) throw new ProviderError("huggingface", false, "HUGGINGFACE_TOKEN not set");
  return new InferenceClient(token);
}

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(429|500|502|503|504|timeout|loading|busy)\b/i.test(msg);
}

function extractJson(text: string): string {
  // Models often wrap JSON in fenced code blocks. Strip them.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) return text.slice(first, last + 1);
  return text;
}

export const huggingface: Provider = {
  name: "huggingface",
  async analyze(input: AnalyzeInput): Promise<AnalyzeOutput> {
    const start = Date.now();
    if (!input.mimeType.startsWith("image/")) {
      // HF vision-instruct only takes images; PDF would need conversion.
      // Skip for v1 — Gemini handles PDF natively, HF is the image fallback.
      throw new ProviderError("huggingface", false, "huggingface fallback supports image/* only");
    }

    const client = getClient();
    const dataUrl = `data:${input.mimeType};base64,${Buffer.from(input.fileBytes).toString("base64")}`;

    const userText = [
      "Analyze the attached document image.",
      input.hintedDocType && input.hintedDocType !== "other"
        ? `User thinks it is a ${input.hintedDocType}; verify and override if wrong.`
        : "",
      `Return STRICT JSON only, no prose, matching this shape:\n${ANALYSIS_JSON_SHAPE}`,
    ]
      .filter(Boolean)
      .join("\n");

    let response;
    try {
      response = await client.chatCompletion({
        model: HF_MODEL,
        messages: [
          { role: "system", content: systemPrompt(input.outputLocale) },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });
    } catch (err) {
      throw new ProviderError(
        "huggingface",
        isRetryable(err),
        `huggingface call failed: ${(err as Error).message}`,
        err,
      );
    }

    const raw = response.choices?.[0]?.message?.content ?? "";
    const text = typeof raw === "string" ? raw : "";
    let parsed;
    try {
      parsed = AnalysisSchema.parse(JSON.parse(extractJson(text)));
    } catch (err) {
      throw new ProviderError(
        "huggingface",
        false,
        `huggingface returned malformed JSON: ${(err as Error).message}`,
        err,
      );
    }

    const inputTokens = response.usage?.prompt_tokens ?? 0;
    const outputTokens = response.usage?.completion_tokens ?? 0;

    return {
      analysis: parsed,
      modelUsed: HF_MODEL,
      provider: "huggingface",
      inputTokens,
      outputTokens,
      costUsd: estimateCostUsd(COST_KEY, inputTokens, outputTokens),
      durationMs: Date.now() - start,
    };
  },
};
