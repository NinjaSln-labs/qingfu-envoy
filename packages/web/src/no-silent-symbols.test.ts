import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const FORBIDDEN = ["silent", "autoPay", "executeWithoutApproval"];

describe("web no silent symbols", () => {
  it("web source has no forbidden identifiers", () => {
    const root = join(fileURLToPath(new URL(".", import.meta.url)));
    const files = ["api.ts", "context.ts", "server.ts", "host-policy.ts"];
    for (const name of files) {
      const text = readFileSync(join(root, name), "utf8");
      for (const sym of FORBIDDEN) {
        expect(text).not.toContain(sym);
      }
    }
  });
});
