import type { AuditEvent } from "../domain/types.js";
import { createMemoryAuditSink, type AuditSink } from "../domain/audit.js";
import type { Envoy } from "../domain/envoy.js";
import type { PaymentProposal } from "../domain/proposal.js";

export interface DataStore {
  getEnvoy(id: string): Envoy | undefined;
  listEnvoys(): Envoy[];
  saveEnvoy(envoy: Envoy): void;
  getProposal(id: string): PaymentProposal | undefined;
  listProposals(): PaymentProposal[];
  saveProposal(proposal: PaymentProposal): void;
  readonly audit: AuditSink;
}

export class MemoryStore implements DataStore {
  private envoys = new Map<string, Envoy>();
  private proposals = new Map<string, PaymentProposal>();
  readonly audit = createMemoryAuditSink();

  getEnvoy(id: string): Envoy | undefined {
    return this.envoys.get(id);
  }

  listEnvoys(): Envoy[] {
    return [...this.envoys.values()];
  }

  saveEnvoy(envoy: Envoy): void {
    this.envoys.set(envoy.id, envoy);
  }

  getProposal(id: string): PaymentProposal | undefined {
    return this.proposals.get(id);
  }

  listProposals(): PaymentProposal[] {
    return [...this.proposals.values()];
  }

  saveProposal(proposal: PaymentProposal): void {
    this.proposals.set(proposal.id, proposal);
  }
}

export function createMemoryStore(): MemoryStore {
  return new MemoryStore();
}

export function createPersistingAuditSink(
  inner: AuditSink,
  onAppend: (event: AuditEvent) => void,
): AuditSink {
  return {
    append(event) {
      inner.append(event);
      onAppend(event);
    },
    list(proposalId) {
      return inner.list(proposalId);
    },
  };
}
