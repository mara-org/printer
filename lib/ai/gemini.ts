import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { AnalysisSchema, ProviderError } from "./types";
import type { AnalyzeInput, AnalyzeOutput } from "./types";
import type { Provider } from "./Provider";
import { systemPrompt } from "./prompts";
import { estimateCostUsd } from "./cost";

const MODEL = "gemini-2.5-flash";

const STRUCTURED_OUTPUT_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    document_type: {
      type: SchemaType.STRING,
      format: "enum",
      enum: [
        "lease",
        "employment_contract",
        "nda",
        "health_insurance",
        "auto_insurance",
        "life_insurance",
        "medical_bill",
        "eob",
        "tax_letter",
        "mortgage",
        "terms_of_service",
        "privacy_policy",
        "other",
      ],
    },
    summary: { type: SchemaType.STRING },
    risks: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          severity: { type: SchemaType.STRING, format: "enum", enum: ["low", "medium", "high"] },
          title: { type: SchemaType.STRING },
          explanation: { type: SchemaType.STRING },
        },
        required: ["severity", "title", "explanation"],
      },
    },
    questions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    key_terms: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          term: { type: SchemaType.STRING },
          definition: { type: SchemaType.STRING },
        },
        required: ["term", "definition"],
      },
    },
    confidence: { type: SchemaType.NUMBER },
  },
  required: ["document_type", "summary", "risks", "questions", "key_terms", "confidence"],
} satisfies Schema;

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new ProviderError("gemini", false, "GEMINI_API_KEY not set");
  return new GoogleGenerativeAI(key);
}

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(429|500|503|504|UNAVAILABLE|RESOURCE_EXHAUSTED|quota)\b/i.test(msg);
}

export const gemini: Provider = {
  name: "gemini",
  async analyze(input: AnalyzeInput): Promise<AnalyzeOutput> {
    const start = Date.now();
    const client = getClient();
    const model = client.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemPrompt(input.outputLocale),
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: STRUCTURED_OUTPUT_SCHEMA,
        temperature: 0.2,
      },
    });

    const userText =
      input.hintedDocType && input.hintedDocType !== "other"
        ? `Analyze the attached document. The user thinks it is a ${input.hintedDocType}, but verify and override if you disagree.`
        : "Analyze the attached document.";

    let result;
    try {
      result = await model.generateContent([
        {
          inlineData: {
            mimeType: input.mimeType,
            data: Buffer.from(input.fileBytes).toString("base64"),
          },
        },
        { text: userText },
      ]);
    } catch (err) {
      throw new ProviderError("gemini", isRetryable(err), `gemini call failed: ${(err as Error).message}`, err);
    }

    const text = result.response.text();
    let parsed;
    try {
      parsed = AnalysisSchema.parse(JSON.parse(text));
    } catch (err) {
      throw new ProviderError("gemini", false, `gemini returned malformed JSON: ${(err as Error).message}`, err);
    }

    const usage = result.response.usageMetadata;
    const inputTokens = usage?.promptTokenCount ?? 0;
    const outputTokens = usage?.candidatesTokenCount ?? 0;

    return {
      analysis: parsed,
      modelUsed: MODEL,
      provider: "gemini",
      inputTokens,
      outputTokens,
      costUsd: estimateCostUsd(MODEL, inputTokens, outputTokens),
      durationMs: Date.now() - start,
    };
  },
};
