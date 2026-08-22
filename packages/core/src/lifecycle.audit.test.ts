import { describe, expect, it } from "vitest";
import { exportAuditJson } from "./app/export-audit.js";
import { ProposalService } from "./app/proposal-service.js";
import { createMockRail } from "./domain/rail.js";
import { createMemoryStore } from "./persistence/store.js";

describe("lifecycle audit", () => {
  it("propose / approve / reject / cancel each emit AuditEvent", async () => {
    const store = createMemoryStore();
    const svc = new ProposalService(store, createMockRail());
    svc.registerEnvoy("e1", "demo");

    const p1 = svc.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "10", currency: "CNY" },
        purpose: "咖啡",
        payeeSummary: "店",
      },
      { kind: "envoy", id: "e1" },
    );
    expect(p1.status).toBe("proposed");

    const p2 = svc.proposePayment(
      {
        id: "p2",
        envoyId: "e1",
        money: { amount: "11", currency: "CNY" },
        purpose: "茶",
        payeeSummary: "店",
      },
      { kind: "envoy", id: "e1" },
    );
    svc.approveProposal("p2", "u1");

    const p3 = svc.proposePayment(
      {
        id: "p3",
        envoyId: "e1",
        money: { amount: "12", currency: "CNY" },
        purpose: "水",
        payeeSummary: "店",
      },
      { kind: "envoy", id: "e1" },
    );
    svc.rejectProposal("p3", "u1");

    const p4 = svc.proposePayment(
      {
        id: "p4",
        envoyId: "e1",
        money: { amount: "13", currency: "CNY" },
        purpose: "饭",
        payeeSummary: "店",
      },
      { kind: "envoy", id: "e1" },
    );
    svc.cancelProposal("p4", { kind: "envoy", id: "e1" });

    const events = store.audit.list();
    expect(events.some((e) => e.action === "propose" && e.to === "proposed")).toBe(
      true,
    );
    expect(events.some((e) => e.action === "approve" && e.to === "approved")).toBe(
      true,
    );
    expect(events.some((e) => e.action === "reject" && e.to === "rejected")).toBe(
      true,
    );
    expect(events.some((e) => e.action === "cancel" && e.to === "cancelled")).toBe(
      true,
    );

    const exported = JSON.parse(exportAuditJson(store.audit));
    expect(exported.length).toBeGreaterThanOrEqual(4);
  });

  it("execute success and failure are audited", async () => {
    const store = createMemoryStore();
    const okSvc = new ProposalService(store, createMockRail());
    okSvc.registerEnvoy("e1", "demo");
    okSvc.proposePayment(
      {
        id: "ok",
        envoyId: "e1",
        money: { amount: "1", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );
    okSvc.approveProposal("ok", "u1");
    await okSvc.executeProposal("ok");

    const failStore = createMemoryStore();
    const failSvc = new ProposalService(
      failStore,
      createMockRail({ failExecute: true }),
    );
    failSvc.registerEnvoy("e1", "demo");
    failSvc.proposePayment(
      {
        id: "fail",
        envoyId: "e1",
        money: { amount: "1", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );
    failSvc.approveProposal("fail", "u1");
    await failSvc.executeProposal("fail");

    expect(
      store.audit.list("ok").some((e) => e.action === "execute"),
    ).toBe(true);
    expect(
      failStore.audit.list("fail").some((e) => e.action === "execute_failed"),
    ).toBe(true);
  });

  it("rejects illegal transitions after reject", () => {
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
    svc.rejectProposal("p1", "u1");
    expect(() => svc.approveProposal("p1", "u1")).toThrow();
  });
});
