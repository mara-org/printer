import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getProductId, isPolarConfigured, tierFromProductId } from "@/lib/polar";

const ENV_KEYS = [
  "POLAR_ACCESS_TOKEN",
  "NEXT_PUBLIC_POLAR_PRODUCT_PRO",
  "NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY",
  "NEXT_PUBLIC_POLAR_PRODUCT_POWER",
  "NEXT_PUBLIC_POLAR_PRODUCT_POWER_YEARLY",
  "NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME",
] as const;

describe("polar helpers", () => {
  const saved: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const k of ENV_KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
  });
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("isPolarConfigured is false without token", () => {
    expect(isPolarConfigured()).toBe(false);
  });

  it("isPolarConfigured needs token AND at least one product", () => {
    process.env.POLAR_ACCESS_TOKEN = "polar_oat_x";
    expect(isPolarConfigured()).toBe(false);
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO = "prod_pro";
    expect(isPolarConfigured()).toBe(true);
  });

  it("getProductId returns null when missing", () => {
    expect(getProductId("pro")).toBeNull();
  });

  it("getProductId returns the configured ID", () => {
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_POWER = "prod_pwr";
    expect(getProductId("power")).toBe("prod_pwr");
  });

  it("tierFromProductId resolves to the right tier", () => {
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO = "prod_pro";
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_LIFETIME = "prod_life";
    expect(tierFromProductId("prod_pro")).toBe("pro");
    expect(tierFromProductId("prod_life")).toBe("lifetime");
    expect(tierFromProductId("prod_unknown")).toBeNull();
  });

  it("yearly products collapse to the same tier as monthly", () => {
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY = "prod_pro_yr";
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_POWER_YEARLY = "prod_pwr_yr";
    expect(tierFromProductId("prod_pro_yr")).toBe("pro");
    expect(tierFromProductId("prod_pwr_yr")).toBe("power");
  });

  it("isPolarConfigured is true when only a yearly product is set", () => {
    process.env.POLAR_ACCESS_TOKEN = "polar_oat_x";
    process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_YEARLY = "prod_pro_yr";
    expect(isPolarConfigured()).toBe(true);
  });
});
