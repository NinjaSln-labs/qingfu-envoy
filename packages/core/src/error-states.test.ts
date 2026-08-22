import { describe, expect, it } from "vitest";
import { ProposalService } from "./app/proposal-service.js";
import { propose } from "./domain/proposal.js";
import { createMockRail } from "./domain/rail.js";
import { DomainError } from "./domain/types.js";
import { createMemoryStore } from "./persistence/store.js";

describe("error states", () => {
  it("propose rejects missing fields", () => {
    expect(() =>
      propose({
        id: "",
        envoyId: "e1",
        money: { amount: "1", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      }),
    ).toThrow(DomainError);
  });

  it("propose rejects non-numeric amount", () => {
    expect(() =>
      propose({
        id: "p1",
        envoyId: "e1",
        money: { amount: "abc", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      }),
    ).toThrow(DomainError);
  });

  it("propose normalizes valid CNY amount", () => {
    const p = propose({
      id: "p1",
      envoyId: "e1",
      money: { amount: "9.9", currency: "CNY" },
      purpose: "x",
      payeeSummary: "y",
    });
    expect(p.money).toEqual({ amount: "9.90", currency: "CNY" });
  });

  it("rejects duplicate proposal id via service", () => {
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
    expect(() =>
      svc.proposePayment(
        {
          id: "p1",
          envoyId: "e1",
          money: { amount: "2", currency: "CNY" },
          purpose: "x",
          payeeSummary: "y",
        },
        { kind: "envoy", id: "e1" },
      ),
    ).toThrow(DomainError);
  });

  it("execute unapproved fails via service", async () => {
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
    await expect(svc.executeProposal("p1")).rejects.toThrow(DomainError);
  });

  it("propose fails when envoy frozen", () => {
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

  it("double execute on executed proposal fails", async () => {
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
    await svc.executeProposal("p1");
    await expect(svc.executeProposal("p1")).rejects.toThrow(DomainError);
  });
});
