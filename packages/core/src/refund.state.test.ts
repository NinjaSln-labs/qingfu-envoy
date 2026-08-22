import { describe, expect, it } from "vitest";
import { RefundService } from "./app/refund-service.js";
import { ProposalService } from "./app/proposal-service.js";
import { createMockRail } from "./domain/rail.js";
import { createMemoryStore } from "./persistence/store.js";

async function executedProposal(
  refundOpts?: Parameters<typeof createMockRail>[0],
) {
  const store = createMemoryStore();
  const rail = createMockRail(refundOpts);
  const proposals = new ProposalService(store, rail);
  const refunds = new RefundService(store, rail);
  proposals.registerEnvoy("e1", "demo");
  proposals.proposePayment(
    {
      id: "p1",
      envoyId: "e1",
      money: { amount: "9.99", currency: "CNY" },
      purpose: "x",
      payeeSummary: "y",
    },
    { kind: "envoy", id: "e1" },
  );
  proposals.approveProposal("p1", "u1");
  await proposals.executeProposal("p1");
  return { store, proposals, refunds };
}

describe("refund state machine", () => {
  it("executed → refunded on rail success", async () => {
    const { refunds } = await executedProposal();
    const next = await refunds.requestRefund("p1", "u1");
    expect(next.status).toBe("refunded");
    expect(next.refundRef).toBe("mock_refund_p1");
  });

  it("executed → refund_failed on rail failure", async () => {
    const { refunds } = await executedProposal({ failRefund: true });
    const next = await refunds.requestRefund("p1", "u1");
    expect(next.status).toBe("refund_failed");
  });

  it("executed → refund_failed with rail_unsupported", async () => {
    const { store, refunds } = await executedProposal({
      refundUnsupported: true,
    });
    const next = await refunds.requestRefund("p1", "u1");
    expect(next.status).toBe("refund_failed");
    const audit = store.audit.list("p1");
    const failed = audit.find((e) => e.action === "refund_failed");
    expect(failed?.detail?.kind).toBe("rail_unsupported");
  });

  it("allows retry after refund_failed", async () => {
    const store = createMemoryStore();
    const failRail = createMockRail({ failRefund: true });
    const proposals = new ProposalService(store, failRail);
    const refunds = new RefundService(store, failRail);
    proposals.registerEnvoy("e1", "demo");
    proposals.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "9.99", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );
    proposals.approveProposal("p1", "u1");
    await proposals.executeProposal("p1");
    await refunds.requestRefund("p1", "u1");

    const okRail = createMockRail();
    const retryRefunds = new RefundService(store, okRail);
    const next = await retryRefunds.requestRefund("p1", "u1");
    expect(next.status).toBe("refunded");
  });
});
