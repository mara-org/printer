import { ProviderError } from "./types";
import type { AnalyzeInput, AnalyzeOutput } from "./types";
import type { Provider } from "./Provider";
import { gemini } from "./gemini";
import { huggingface } from "./huggingface";

// Order matters. Gemini first; HF only as fallback when Gemini is unavailable.
const DEFAULT_CHAIN: Provider[] = [gemini, huggingface];

export type AnalyzeError = {
  kind: "all_providers_failed";
  attempts: Array<{ provider: string; message: string; retryable: boolean }>;
};

export async function analyzeWithFallback(
  input: AnalyzeInput,
  chain: Provider[] = DEFAULT_CHAIN,
): Promise<AnalyzeOutput> {
  const attempts: AnalyzeError["attempts"] = [];
  for (const provider of chain) {
    try {
      return await provider.analyze(input);
    } catch (err) {
      const pe = err instanceof ProviderError ? err : new ProviderError(provider.name, false, String(err));
      attempts.push({ provider: pe.provider, message: pe.message, retryable: pe.retryable });
      // If the error is non-retryable AND not a transient quota/availability issue, do not try next provider.
      // We DO continue on retryable errors (Gemini quota → fall through to HF).
      if (!pe.retryable && !/quota|exhaust|unavailable|429|503|504/i.test(pe.message)) {
        throw err;
      }
    }
  }
  const e = new Error(`all providers failed: ${attempts.map((a) => `${a.provider}=${a.message}`).join("; ")}`);
  (e as Error & { attempts: AnalyzeError["attempts"] }).attempts = attempts;
  throw e;
}

export const __testing = { DEFAULT_CHAIN };
