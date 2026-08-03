import { describe, it, expect } from "vitest";
import { pickStage } from "@/lib/lifecycle";

describe("pickStage", () => {
  it("sends day0 on signup day", () => {
    expect(pickStage(0, null)).toBe("day0");
  });

  it("sends day1 on the next day", () => {
    expect(pickStage(1, 0)).toBe("day1");
  });

  it("sends day7 quota nudge on day 7", () => {
    expect(pickStage(7, 5)).toBe("day7");
  });

  it("sends nothing on off-schedule days", () => {
    expect(pickStage(2, 0)).toBeNull();
    expect(pickStage(8, 1)).toBeNull();
    expect(pickStage(15, 0)).toBeNull();
  });

  it("sends day30 anniversary", () => {
    expect(pickStage(30, 25)).toBe("day30");
  });

  it("sends winback at day >=60 only when inactive >=30 days", () => {
    expect(pickStage(60, 30)).toBe("day60_winback");
    expect(pickStage(80, null)).toBe("day60_winback");
    expect(pickStage(60, 5)).toBeNull();
  });
});
