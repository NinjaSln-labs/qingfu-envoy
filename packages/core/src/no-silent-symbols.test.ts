import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as pkg from "./index.js";

const FORBIDDEN = ["silent", "autoPay", "executeWithoutApproval"];

function listSourceFiles(): string[] {
  const root = join(fileURLToPath(new URL(".", import.meta.url)));
  const files: string[] = [];
  for (const dir of ["domain", "app", "persistence"]) {
    for (const name of [
      "types.ts",
      "proposal.ts",
      "envoy.ts",
      "audit.ts",
      "rail.ts",
      "execution.ts",
      "refund.ts",
      "money.ts",
      "payment-execution-service.ts",
      "proposal-service.ts",
      "refund-service.ts",
      "export-audit.ts",
      "store.ts",
      "json-store.ts",
      "fs-hardening.ts",
      "index.ts",
    ]) {
      const path = join(root, dir, name);
      try {
        readFileSync(path);
        files.push(path);
      } catch {
        // skip missing
      }
    }
  }
  files.push(join(root, "index.ts"));
  return files;
}

describe("no silent symbols", () => {
  it("source has no forbidden silent-pay identifiers", () => {
    const files = listSourceFiles();
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      for (const sym of FORBIDDEN) {
        expect(text).not.toContain(sym);
      }
    }
  });

  it("public exports have no forbidden names", () => {
    const names = Object.keys(pkg);
    for (const sym of FORBIDDEN) {
      expect(names.some((n) => n.includes(sym))).toBe(false);
    }
  });
});
