import { assertValidMoney, parseMoney } from "./money.js";
import { DomainError, type ProposalStatus } from "./types.js";
import type { Money } from "./money.js";

export type { Money };

export type PaymentProposal = {
  id: string;
  envoyId: string;
  money: Money;
  purpose: string;
  payeeSummary: string;
  status: ProposalStatus;
  createdAt: string;
  railRef?: string;
  failureReason?: string;
  refundRef?: string;
};

export type ProposeInput = {
  id: string;
  envoyId: string;
  money: Money;
  purpose: string;
  payeeSummary: string;
  createdAt?: string;
};

function requireNonEmpty(label: string, value: string): void {
  if (!value.trim()) {
    throw new DomainError(`${label} is required`);
  }
}

export function propose(input: ProposeInput): PaymentProposal {
  requireNonEmpty("id", input.id);
  requireNonEmpty("envoyId", input.envoyId);
  requireNonEmpty("purpose", input.purpose);
  requireNonEmpty("payeeSummary", input.payeeSummary);

  const money = parseMoney(input.money.amount, input.money.currency);

  return {
    id: input.id,
    envoyId: input.envoyId,
    money,
    purpose: input.purpose.trim(),
    payeeSummary: input.payeeSummary.trim(),
    status: "proposed",
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function approve(proposal: PaymentProposal): PaymentProposal {
  assertStatus(proposal, "proposed", "approve");
  return { ...proposal, status: "approved" };
}

export function reject(proposal: PaymentProposal): PaymentProposal {
  assertStatus(proposal, "proposed", "reject");
  return { ...proposal, status: "rejected" };
}

export function cancel(proposal: PaymentProposal): PaymentProposal {
  assertStatus(proposal, "proposed", "cancel");
  return { ...proposal, status: "cancelled" };
}

export function markExecuted(
  proposal: PaymentProposal,
  railRef: string,
): PaymentProposal {
  assertStatus(proposal, "approved", "markExecuted");
  requireNonEmpty("railRef", railRef);
  return { ...proposal, status: "executed", railRef };
}

export function markFailed(
  proposal: PaymentProposal,
  reason: string,
): PaymentProposal {
  assertStatus(proposal, "approved", "markFailed");
  return { ...proposal, status: "failed", failureReason: reason };
}

export function markRefunded(
  proposal: PaymentProposal,
  refundRef: string,
): PaymentProposal {
  assertRefundEligible(proposal, "markRefunded");
  requireNonEmpty("refundRef", refundRef);
  return { ...proposal, status: "refunded", refundRef };
}

export function markRefundFailed(
  proposal: PaymentProposal,
  reason: string,
): PaymentProposal {
  assertRefundEligible(proposal, "markRefundFailed");
  return { ...proposal, status: "refund_failed", failureReason: reason };
}

function assertRefundEligible(
  proposal: PaymentProposal,
  action: string,
): void {
  if (proposal.status !== "executed" && proposal.status !== "refund_failed") {
    throw new DomainError(
      `cannot ${action} proposal ${proposal.id} in status ${proposal.status}`,
    );
  }
}

function assertStatus(
  proposal: PaymentProposal,
  expected: ProposalStatus,
  action: string,
): void {
  if (proposal.status !== expected) {
    throw new DomainError(
      `cannot ${action} proposal ${proposal.id} in status ${proposal.status}`,
    );
  }
}
