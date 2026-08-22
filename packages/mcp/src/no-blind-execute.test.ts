import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ENVOY_TOOL_NAMES, FORBIDDEN_TOOL_SUBSTRINGS } from "./tools.js";
import { registeredToolNames } from "./register-tools.js";

describe("mcp no blind execute", () => {
  it("only exposes envoy-safe tool names", () => {
    expect(registeredToolNames()).toEqual(ENVOY_TOOL_NAMES);
    for (const name of ENVOY_TOOL_NAMES) {
      const lower = name.toLowerCase();
      for (const forbidden of FORBIDDEN_TOOL_SUBSTRINGS) {
        expect(lower).not.toContain(forbidden);
      }
    }
  });

  it("mcp source has no executeWithoutApproval symbols", () => {
    const root = join(fileURLToPath(new URL(".", import.meta.url)));
    const files = [
      "handlers.ts",
      "register-tools.ts",
      "server.ts",
      "context.ts",
      "tools.ts",
    ];
    const forbidden = ["silent", "autoPay", "executeWithoutApproval"];
    for (const name of files) {
      const text = readFileSync(join(root, name), "utf8");
      for (const sym of forbidden) {
        expect(text).not.toContain(sym);
      }
      expect(text).not.toMatch(/\bexecuteProposal\b/);
    }
  });
});
