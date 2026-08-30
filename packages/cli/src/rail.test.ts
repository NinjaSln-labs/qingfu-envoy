import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { runCommand } from "./commands.js";
import { openCliContext } from "./context.js";
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

describe("rail selection (T6.1)", () => {
  it("parseRailName accepts mock|alipay", () => {
    expect(parseRailName("mock")).toBe("mock");
    expect(parseRailName("alipay")).toBe("alipay");
    expect(() => parseRailName("wechat")).toThrow(/unknown rail/);
  });

  it("alipay without credentials refuses mock fallback", () => {
    clearAlipayEnv();
    expect(() => resolvePaymentRail("alipay")).toThrow(/refusing to fall back to mock/);
  });

  it("execute --rail alipay without env returns readable error", async () => {
    clearAlipayEnv();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-rail-"));
    const ctx = await openCliContext(dir, "mock");
    await runCommand(ctx, ["envoy", "register", "e1", "--name", "demo"]);
    await runCommand(ctx, [
      "propose",
      "--envoy",
      "e1",
      "--id",
      "p1",
      "--amount",
      "1.00",
      "--purpose",
      "t",
      "--payee",
      "shop",
    ]);
    await runCommand(ctx, ["approve", "p1"]);
    const r = await runCommand(ctx, ["execute", "p1", "--rail", "alipay"]);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toMatch(/ALIPAY_APP_ID/);
      expect(r.error).toMatch(/refusing to fall back to mock/);
    }
  });

  it("default mock execute still works", async () => {
    clearAlipayEnv();
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-rail-mock-"));
    const ctx = await openCliContext(dir, "mock");
    await runCommand(ctx, ["envoy", "register", "e1", "--name", "demo"]);
    await runCommand(ctx, [
      "propose",
      "--envoy",
      "e1",
      "--id",
      "p1",
      "--amount",
      "1.00",
      "--purpose",
      "t",
      "--payee",
      "shop",
    ]);
    await runCommand(ctx, ["approve", "p1"]);
    const r = await runCommand(ctx, ["execute", "p1"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("executed");
  });
});
