import { z } from "zod";

export type Tier = "free" | "pro" | "power" | "lifetime";

export const DocTypeEnum = z.enum([
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
]);
export type DocType = z.infer<typeof DocTypeEnum>;

export const RiskSchema = z.object({
  severity: z.enum(["low", "medium", "high"]),
  title: z.string().min(1).max(200),
  explanation: z.string().min(1).max(2000),
});

export const KeyTermSchema = z.object({
  term: z.string().min(1).max(120),
  definition: z.string().min(1).max(800),
});

export const AnalysisSchema = z.object({
  document_type: DocTypeEnum,
  summary: z.string().min(1).max(4000),
  risks: z.array(RiskSchema).max(20),
  questions: z.array(z.string().min(1).max(300)).max(10),
  key_terms: z.array(KeyTermSchema).max(20),
  confidence: z.number().min(0).max(1),
});
export type Analysis = z.infer<typeof AnalysisSchema>;

export type AnalyzeInput = {
  fileBytes: Uint8Array;
  mimeType: string;
  outputLocale: string;
  hintedDocType?: DocType;
};

export type AnalyzeOutput = {
  analysis: Analysis;
  modelUsed: string;
  provider: "gemini" | "huggingface";
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  durationMs: number;
};

export class ProviderError extends Error {
  constructor(
    public readonly provider: string,
    public readonly retryable: boolean,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
