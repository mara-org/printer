import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isCronAuthorized } from "@/lib/cron-auth";

const SECRET = "test-secret-1234567890";

describe("isCronAuthorized", () => {
  let prev: string | undefined;
  beforeEach(() => {
    prev = process.env.CRON_SECRET;
    process.env.CRON_SECRET = SECRET;
  });
  afterEach(() => {
    if (prev === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prev;
  });

  it("rejects requests with no header", () => {
    expect(isCronAuthorized(new Request("http://x/?"))).toBe(false);
  });

  it("accepts header match", () => {
    expect(isCronAuthorized(new Request("http://x/", { headers: { "x-cron-secret": SECRET } }))).toBe(true);
  });

  it("accepts query-string match", () => {
    expect(isCronAuthorized(new Request(`http://x/?secret=${SECRET}`))).toBe(true);
  });

  it("rejects wrong secret", () => {
    expect(isCronAuthorized(new Request("http://x/", { headers: { "x-cron-secret": "nope" } }))).toBe(false);
  });

  it("rejects when CRON_SECRET is unset", () => {
    delete process.env.CRON_SECRET;
    expect(isCronAuthorized(new Request("http://x/", { headers: { "x-cron-secret": SECRET } }))).toBe(false);
  });
});
