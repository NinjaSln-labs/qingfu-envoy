import { describe, expect, it } from "vitest";
import { exportAuditJson } from "./app/export-audit.js";
import { ProposalService } from "./app/proposal-service.js";
import { createMockRail } from "./domain/rail.js";
import { createMemoryStore } from "./persistence/store.js";

describe("export-audit", () => {
  it("JSON includes actor, from, and to on proposal events", () => {
    const store = createMemoryStore();
    const svc = new ProposalService(store, createMockRail());
    svc.registerEnvoy("e1", "demo");
    svc.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "1", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );
    svc.approveProposal("p1", "u1");

    const json = exportAuditJson(store.audit, "p1");
    const events = JSON.parse(json) as Array<{
      actor: { kind: string };
      from: string | null;
      to: string | null;
      scope: string;
    }>;

    expect(events.length).toBeGreaterThan(0);
    for (const e of events) {
      expect(e.scope).toBe("proposal");
      expect(e.actor).toBeDefined();
      expect("from" in e).toBe(true);
      expect(e.to).toBeDefined();
    }
  });

  it("exports full propose → approve → execute chain for one proposal", async () => {
    const store = createMemoryStore();
    const svc = new ProposalService(store, createMockRail());
    svc.registerEnvoy("e1", "demo");
    svc.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "2", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );
    svc.approveProposal("p1", "u1");
    await svc.executeProposal("p1");

    const events = JSON.parse(exportAuditJson(store.audit, "p1")) as Array<{
      action: string;
      from: string | null;
      to: string | null;
    }>;

    expect(events).toHaveLength(3);
    expect(events.map((e) => e.action)).toEqual([
      "propose",
      "approve",
      "execute",
    ]);
    expect(events[0]).toMatchObject({ from: null, to: "proposed" });
    expect(events[1]).toMatchObject({ from: "proposed", to: "approved" });
    expect(events[2]).toMatchObject({ from: "approved", to: "executed" });
  });
});
