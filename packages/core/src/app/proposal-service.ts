import { recordEnvoyAction, recordTransition } from "../domain/audit.js";
import { executeApproved } from "../domain/execution.js";
import {
  assertCanPropose,
  createEnvoy,
  freeze,
  unfreeze,
  type Envoy,
} from "../domain/envoy.js";
import {
  approve,
  cancel,
  propose,
  reject,
  type PaymentProposal,
  type ProposeInput,
} from "../domain/proposal.js";
import type { PaymentRail } from "../domain/rail.js";
import { DomainError, type Actor } from "../domain/types.js";
import type { DataStore } from "../persistence/store.js";
import { AuditIdSeq } from "./audit-id.js";

export type ProposalServiceMeta = {
  auditIdPrefix?: string;
};

export class ProposalService {
  private readonly auditIds: AuditIdSeq;

  constructor(
    private readonly store: DataStore,
    private readonly rail: PaymentRail,
    private readonly meta: ProposalServiceMeta = {},
  ) {
    this.auditIds = new AuditIdSeq(meta.auditIdPrefix ?? "a");
  }

  registerEnvoy(id: string, displayName: string): Envoy {
    const existing = this.store.getEnvoy(id);
    if (existing) {
      return existing;
    }
    const envoy = createEnvoy(id, displayName);
    this.store.saveEnvoy(envoy);
    return envoy;
  }

  getEnvoy(id: string): Envoy | undefined {
    return this.store.getEnvoy(id);
  }

  getProposal(id: string): PaymentProposal | undefined {
    return this.store.getProposal(id);
  }

  listProposals(): PaymentProposal[] {
    return this.store.listProposals();
  }

  proposePayment(
    input: ProposeInput,
    actor: Actor,
  ): PaymentProposal {
    const envoy = this.store.getEnvoy(input.envoyId);
    if (!envoy) {
      throw new DomainError(`Envoy ${input.envoyId} not found`);
    }
    assertCanPropose(envoy);

    if (this.store.getProposal(input.id)) {
      throw new DomainError(`Proposal ${input.id} already exists`);
    }

    const proposal = propose(input);
    recordTransition(this.store.audit, {
      id: this.auditIds.next("propose"),
      proposalId: proposal.id,
      actor,
      action: "propose",
      from: null,
      to: "proposed",
    });
    this.store.saveProposal(proposal);
    return proposal;
  }

  approveProposal(proposalId: string, principalId: string): PaymentProposal {
    const current = this.requireProposal(proposalId);
    const next = approve(current);
    recordTransition(this.store.audit, {
      id: this.auditIds.next("approve"),
      proposalId,
      actor: { kind: "principal", id: principalId },
      action: "approve",
      from: "proposed",
      to: "approved",
    });
    this.store.saveProposal(next);
    return next;
  }

  rejectProposal(proposalId: string, principalId: string): PaymentProposal {
    const current = this.requireProposal(proposalId);
    const next = reject(current);
    recordTransition(this.store.audit, {
      id: this.auditIds.next("reject"),
      proposalId,
      actor: { kind: "principal", id: principalId },
      action: "reject",
      from: "proposed",
      to: "rejected",
    });
    this.store.saveProposal(next);
    return next;
  }

  cancelProposal(proposalId: string, actor: Actor): PaymentProposal {
    const current = this.requireProposal(proposalId);
    const next = cancel(current);
    recordTransition(this.store.audit, {
      id: this.auditIds.next("cancel"),
      proposalId,
      actor,
      action: "cancel",
      from: "proposed",
      to: "cancelled",
    });
    this.store.saveProposal(next);
    return next;
  }

  async executeProposal(
    proposalId: string,
    actor: Actor = { kind: "system" },
  ): Promise<PaymentProposal> {
    const current = this.requireProposal(proposalId);
    const next = await executeApproved(
      current,
      this.rail,
      this.store.audit,
      { actor, auditId: this.auditIds.next("execute") },
    );
    this.store.saveProposal(next);
    return next;
  }

  freezeEnvoy(envoyId: string, principalId: string): Envoy {
    const envoy = this.requireEnvoy(envoyId);
    const next = freeze(envoy);
    recordEnvoyAction(this.store.audit, {
      id: this.auditIds.next("freeze"),
      envoyId,
      actor: { kind: "principal", id: principalId },
      action: "freeze",
      detail: { frozen: true },
    });
    this.store.saveEnvoy(next);
    return next;
  }

  unfreezeEnvoy(envoyId: string, principalId: string): Envoy {
    const envoy = this.requireEnvoy(envoyId);
    const next = unfreeze(envoy);
    recordEnvoyAction(this.store.audit, {
      id: this.auditIds.next("unfreeze"),
      envoyId,
      actor: { kind: "principal", id: principalId },
      action: "unfreeze",
      detail: { frozen: false },
    });
    this.store.saveEnvoy(next);
    return next;
  }

  private requireProposal(id: string): PaymentProposal {
    const proposal = this.store.getProposal(id);
    if (!proposal) {
      throw new DomainError(`Proposal ${id} not found`);
    }
    return proposal;
  }

  private requireEnvoy(id: string): Envoy {
    const envoy = this.store.getEnvoy(id);
    if (!envoy) {
      throw new DomainError(`Envoy ${id} not found`);
    }
    return envoy;
  }
}
