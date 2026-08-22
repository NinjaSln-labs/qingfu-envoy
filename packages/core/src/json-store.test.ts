import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ProposalService } from "./app/proposal-service.js";
import { createMockRail } from "./domain/rail.js";
import { JsonStore } from "./persistence/json-store.js";

describe("json-store persistence", () => {
  it("writes proposals, envoys, and audit to data dir", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "qingfu-test-"));
    const store = await JsonStore.open(dir);
    const svc = new ProposalService(store, createMockRail());
    await store.ensureEnvoy("e1", "demo");

    svc.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "5", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );

    const proposalsRaw = await fs.readFile(
      path.join(dir, "proposals.json"),
      "utf8",
    );
    expect(proposalsRaw).toContain("p1");

    const envoysRaw = await fs.readFile(path.join(dir, "envoys.json"), "utf8");
    expect(envoysRaw).toContain("e1");

    const auditRaw = await fs.readFile(path.join(dir, "audit.jsonl"), "utf8");
    expect(auditRaw).toContain("propose");

    const reopened = await JsonStore.open(dir);
    expect(reopened.getProposal("p1")?.id).toBe("p1");
    expect(reopened.getEnvoy("e1")?.id).toBe("e1");
    expect(reopened.audit.list().length).toBeGreaterThan(0);
  });
});
