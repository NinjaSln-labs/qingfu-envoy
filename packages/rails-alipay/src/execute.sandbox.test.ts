import { describe, expect, it } from "vitest";
import {
  createAlipayRail,
  hasAlipaySandboxCredentials,
  loadAlipayConfigFromEnv,
} from "./index.js";

const sandboxReady = hasAlipaySandboxCredentials();

describe.skipIf(!sandboxReady)("alipay sandbox execute", () => {
  it("executes uni transfer against sandbox when env is configured", async () => {
    const config = loadAlipayConfigFromEnv();
    expect(config).not.toBeNull();
    const rail = createAlipayRail(config!);
    const result = await rail.execute({
      proposalId: `sandbox_${Date.now()}`,
      money: { amount: "0.10", currency: "CNY" },
      purpose: "qingfu-envoy sandbox dogfood",
      payeeSummary: "sandbox payee",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.railRef).toBeTruthy();
    }
  });
});

describe("alipay sandbox execute (no env)", () => {
  it("skips live sandbox when credentials missing", () => {
    if (sandboxReady) {
      expect(loadAlipayConfigFromEnv()).not.toBeNull();
    } else {
      expect(hasAlipaySandboxCredentials()).toBe(false);
    }
  });
});
