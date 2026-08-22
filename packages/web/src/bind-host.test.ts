import { describe, expect, it } from "vitest";
import { assertLocalhostHost } from "./host-policy.js";
import { webHost } from "./context.js";

describe("web localhost bind", () => {
  it("defaults to 127.0.0.1", () => {
    const prev = process.env.QINGFU_WEB_HOST;
    delete process.env.QINGFU_WEB_HOST;
    expect(webHost()).toBe("127.0.0.1");
    if (prev) {
      process.env.QINGFU_WEB_HOST = prev;
    }
  });

  it("rejects non-localhost QINGFU_WEB_HOST", () => {
    expect(() => assertLocalhostHost("0.0.0.0")).toThrow(/localhost-only/);
    expect(() => assertLocalhostHost("127.0.0.1")).not.toThrow();
  });
});
