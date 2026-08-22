import { DomainError, type PaymentProposal } from "@qingfu/core";
import type { McpContext } from "./context.js";

export type ProposeInput = {
  envoyId: string;
  proposalId: string;
  amount: string;
  currency?: string;
  purpose: string;
  payee: string;
};

export type ListInput = {
  envoyId?: string;
};

export type ProposalIdInput = {
  proposalId: string;
};

export type StatusResult = {
  proposalId: string;
  status: string;
  envoyId: string;
  railRef?: string;
};

export function handlePropose(
  ctx: McpContext,
  input: ProposeInput,
): PaymentProposal {
  return ctx.proposals.proposePayment(
    {
      id: input.proposalId,
      envoyId: input.envoyId,
      money: { amount: input.amount, currency: input.currency ?? "CNY" },
      purpose: input.purpose,
      payeeSummary: input.payee,
    },
    { kind: "envoy", id: input.envoyId },
  );
}

export function handleList(
  ctx: McpContext,
  input: ListInput = {},
): PaymentProposal[] {
  const all = ctx.proposals.listProposals();
  if (!input.envoyId) {
    return all;
  }
  return all.filter((p) => p.envoyId === input.envoyId);
}

export function handleGet(
  ctx: McpContext,
  input: ProposalIdInput,
): PaymentProposal {
  const proposal = ctx.proposals.getProposal(input.proposalId);
  if (!proposal) {
    throw new DomainError(`Proposal ${input.proposalId} not found`);
  }
  return proposal;
}

export function handleCancel(
  ctx: McpContext,
  input: ProposalIdInput,
): PaymentProposal {
  const proposal = handleGet(ctx, input);
  return ctx.proposals.cancelProposal(input.proposalId, {
    kind: "envoy",
    id: proposal.envoyId,
  });
}

export function handleStatus(
  ctx: McpContext,
  input: ProposalIdInput,
): StatusResult {
  const proposal = handleGet(ctx, input);
  return {
    proposalId: proposal.id,
    status: proposal.status,
    envoyId: proposal.envoyId,
    railRef: proposal.railRef,
  };
}
