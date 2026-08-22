import { recordTransition, type AuditSink } from "./audit.js";
import {
  markExecuted,
  markFailed,
  type PaymentProposal,
} from "./proposal.js";
import type { PaymentRail } from "./rail.js";
import { DomainError, type Actor } from "./types.js";

/**
 * Execute only after human approve. There is intentionally no silent/auto path.
 */
export async function executeApproved(
  proposal: PaymentProposal,
  rail: PaymentRail,
  audit: AuditSink,
  meta: { actor: Actor; auditId: string },
): Promise<PaymentProposal> {
  if (proposal.status !== "approved") {
    throw new DomainError(
      `refuse execute: proposal must be approved (got ${proposal.status})`,
    );
  }

  const result = await rail.execute({
    proposalId: proposal.id,
    money: proposal.money,
    purpose: proposal.purpose,
    payeeSummary: proposal.payeeSummary,
  });

  if (result.ok) {
    const next = markExecuted(proposal, result.railRef);
    recordTransition(audit, {
      id: meta.auditId,
      proposalId: proposal.id,
      actor: meta.actor,
      action: "execute",
      from: "approved",
      to: "executed",
      detail: { rail: rail.name, railRef: result.railRef },
    });
    return next;
  }

  const next = markFailed(proposal, result.error);
  recordTransition(audit, {
    id: meta.auditId,
    proposalId: proposal.id,
    actor: meta.actor,
    action: "execute_failed",
    from: "approved",
    to: "failed",
    detail: { rail: rail.name, error: result.error },
  });
  return next;
}
