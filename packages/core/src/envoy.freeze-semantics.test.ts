import { describe, expect, it } from "vitest";
import { ProposalService } from "./app/proposal-service.js";
import { createMockRail } from "./domain/rail.js";
import { DomainError } from "./domain/types.js";
import { createMemoryStore } from "./persistence/store.js";

describe("envoy freeze semantics (ADR 004)", () => {
  it("frozen envoy cannot propose", () => {
    const store = createMemoryStore();
    const svc = new ProposalService(store, createMockRail());
    svc.registerEnvoy("e1", "demo");
    svc.freezeEnvoy("e1", "u1");

    expect(() =>
      svc.proposePayment(
        {
          id: "p1",
          envoyId: "e1",
          money: { amount: "1", currency: "CNY" },
          purpose: "x",
          payeeSummary: "y",
        },
        { kind: "envoy", id: "e1" },
      ),
    ).toThrow(DomainError);
  });

  it("frozen envoy still allows execute on approved proposal", async () => {
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
    svc.freezeEnvoy("e1", "u1");

    const next = await svc.executeProposal("p1");
    expect(next.status).toBe("executed");
  });

  it("frozen envoy can cancel proposed payment (P0-6)", () => {
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
    svc.freezeEnvoy("e1", "u1");

    const cancelled = svc.cancelProposal("p1", { kind: "envoy", id: "e1" });
    expect(cancelled.status).toBe("cancelled");
  });

  it("freeze audit is envoy-scoped and excluded from proposal export", () => {
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
    svc.freezeEnvoy("e1", "u1");

    expect(store.audit.list("p1").every((e) => e.scope === "proposal")).toBe(
      true,
    );
    expect(store.audit.list().some((e) => e.scope === "envoy")).toBe(true);
  });

  it("unfreeze allows propose again", () => {
    const store = createMemoryStore();
    const svc = new ProposalService(store, createMockRail());
    svc.registerEnvoy("e1", "demo");
    svc.freezeEnvoy("e1", "u1");
    svc.unfreezeEnvoy("e1", "u1");

    const p = svc.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "1", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );
    expect(p.status).toBe("proposed");
  });
});
