import { recordTransition, type AuditSink } from "./audit.js";
import {
  markRefundFailed,
  markRefunded,
  type PaymentProposal,
} from "./proposal.js";
import type { PaymentRail } from "./rail.js";
import { DomainError, type Actor } from "./types.js";

export async function requestRefund(
  proposal: PaymentProposal,
  rail: PaymentRail,
  audit: AuditSink,
  meta: { actor: Actor; auditId: string },
): Promise<PaymentProposal> {
  if (proposal.status !== "executed" && proposal.status !== "refund_failed") {
    throw new DomainError(
      `refuse refund: proposal must be executed or refund_failed (got ${proposal.status})`,
    );
  }
  if (!proposal.railRef) {
    throw new DomainError(
      `refuse refund: proposal ${proposal.id} has no railRef`,
    );
  }

  const from = proposal.status;
  const result = await rail.refund({
    proposalId: proposal.id,
    railRef: proposal.railRef,
    money: proposal.money,
  });

  if (result.ok) {
    const next = markRefunded(proposal, result.refundRef);
    recordTransition(audit, {
      id: meta.auditId,
      proposalId: proposal.id,
      actor: meta.actor,
      action: "refund",
      from,
      to: "refunded",
      detail: { rail: rail.name, refundRef: result.refundRef },
    });
    return next;
  }

  const next = markRefundFailed(proposal, result.error);
  recordTransition(audit, {
    id: meta.auditId,
    proposalId: proposal.id,
    actor: meta.actor,
    action: "refund_failed",
    from,
    to: "refund_failed",
    detail: {
      rail: rail.name,
      error: result.error,
      kind: result.kind ?? "failed",
    },
  });
  return next;
}
