import type { AnalyzeInput, AnalyzeOutput } from "./types";

export interface Provider {
  readonly name: "gemini" | "huggingface";
  analyze(input: AnalyzeInput): Promise<AnalyzeOutput>;
}
