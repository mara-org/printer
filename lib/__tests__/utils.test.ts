import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("filters falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("merges conflicting tailwind classes (later wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("preserves non-conflicting tailwind classes", () => {
    expect(cn("text-sm", "font-medium")).toBe("text-sm font-medium");
  });

  it("handles arrays and conditionals", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});
