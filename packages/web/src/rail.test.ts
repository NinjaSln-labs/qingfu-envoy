import { afterEach, describe, expect, it } from "vitest";
import { parseRailName, resolvePaymentRail } from "./rail.js";

function clearAlipayEnv() {
  for (const k of [
    "ALIPAY_APP_ID",
    "ALIPAY_PRIVATE_KEY",
    "ALIPAY_PUBLIC_KEY",
    "AIPAY_APP_ID",
    "AIPAY_PRIVATE_KEY",
    "AIPAY_PUBLIC_KEY",
    "QINGFU_RAIL",
  ]) {
    delete process.env[k];
  }
}

afterEach(() => {
  clearAlipayEnv();
});

describe("web rail selection (T6.1)", () => {
  it("alipay without credentials refuses mock fallback", () => {
    clearAlipayEnv();
    expect(() => resolvePaymentRail("alipay")).toThrow(/refusing to fall back to mock/);
  });

  it("parseRailName rejects unknown", () => {
    expect(() => parseRailName("stripe")).toThrow(/unknown rail/);
  });
});
