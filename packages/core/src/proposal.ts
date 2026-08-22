import { DomainError, type Money, type ProposalStatus } from "./types.js";

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
  requireNonEmpty("currency", input.money.currency);
  requireNonEmpty("amount", input.money.amount);
  if (Number(input.money.amount) <= 0) {
    throw new DomainError("amount must be positive");
  }

  return {
    id: input.id,
    envoyId: input.envoyId,
    money: input.money,
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
