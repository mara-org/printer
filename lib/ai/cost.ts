// Cost per million tokens. Source: published price sheets at time of writing.
// Gemini 2.5 Flash paid tier 1: $0.075 input / $0.30 output per 1M tokens.
// Hugging Face Inference Providers: free credits monthly; cost is "0" to us
// until credits exhaust, after which the route falls back. We bill 0 for HF.

const PRICES: Record<string, { input: number; output: number }> = {
  "gemini-2.5-flash": { input: 0.075, output: 0.3 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "hf-llama-3.2-vision": { input: 0, output: 0 },
  "hf-qwen2-vl": { input: 0, output: 0 },
};

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICES[model] ?? { input: 0, output: 0 };
  return (p.input * inputTokens + p.output * outputTokens) / 1_000_000;
}
