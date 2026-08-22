import { describe, expect, it } from "vitest";
import {
  approve,
  assertCanPropose,
  cancel,
  createEnvoy,
  createMemoryAuditSink,
  createMockRail,
  DomainError,
  executeApproved,
  freeze,
  propose,
  recordTransition,
  reject,
} from "./index.js";

describe("PaymentProposal lifecycle", () => {
  it("propose → approve → execute via mock rail", async () => {
    const envoy = createEnvoy("e1", "demo");
    assertCanPropose(envoy);
    const audit = createMemoryAuditSink();
    let p = propose({
      id: "p1",
      envoyId: envoy.id,
      money: { amount: "12.50", currency: "CNY" },
      purpose: "买咖啡",
      payeeSummary: "某咖啡店",
    });
    expect(p.status).toBe("proposed");
    recordTransition(audit, {
      id: "a0",
      proposalId: p.id,
      actor: { kind: "envoy", id: envoy.id },
      action: "propose",
      from: null,
      to: "proposed",
    });

    p = approve(p);
    recordTransition(audit, {
      id: "a1",
      proposalId: p.id,
      actor: { kind: "principal", id: "u1" },
      action: "approve",
      from: "proposed",
      to: "approved",
    });

    p = await executeApproved(p, createMockRail(), audit, {
      actor: { kind: "system" },
      auditId: "a2",
    });
    expect(p.status).toBe("executed");
    expect(p.railRef).toBe("mock_p1");
    expect(audit.list("p1")).toHaveLength(3);
  });

  it("refuses execute before approve", async () => {
    const p = propose({
      id: "p2",
      envoyId: "e1",
      money: { amount: "1", currency: "CNY" },
      purpose: "x",
      payeeSummary: "y",
    });
    await expect(
      executeApproved(p, createMockRail(), createMemoryAuditSink(), {
        actor: { kind: "system" },
        auditId: "a",
      }),
    ).rejects.toBeInstanceOf(DomainError);
  });

  it("reject and cancel only from proposed", () => {
    const base = {
      id: "p3",
      envoyId: "e1",
      money: { amount: "1", currency: "CNY" },
      purpose: "x",
      payeeSummary: "y",
    };
    expect(reject(propose(base)).status).toBe("rejected");
    expect(cancel(propose({ ...base, id: "p4" })).status).toBe("cancelled");
    expect(() => approve(reject(propose({ ...base, id: "p5" })))).toThrow(
      DomainError,
    );
  });

  it("frozen envoy cannot propose", () => {
    const frozen = freeze(createEnvoy("e2", "x"));
    expect(() => assertCanPropose(frozen)).toThrow(DomainError);
  });
});
