import { describe, it, expect } from "vitest";
import { estimateCostUsd } from "@/lib/ai/cost";

describe("estimateCostUsd", () => {
  it("computes Gemini Flash cost", () => {
    // 10K input + 2K output → 0.075*10000 + 0.3*2000 = 750+600 = 1350 / 1e6 = 0.00135
    expect(estimateCostUsd("gemini-2.5-flash", 10_000, 2_000)).toBeCloseTo(0.00135, 6);
  });

  it("returns 0 for HF (free credits)", () => {
    expect(estimateCostUsd("hf-llama-3.2-vision", 100_000, 100_000)).toBe(0);
  });

  it("returns 0 for unknown model", () => {
    expect(estimateCostUsd("nonexistent", 1000, 1000)).toBe(0);
  });
});
