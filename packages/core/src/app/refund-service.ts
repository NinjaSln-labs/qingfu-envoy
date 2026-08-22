import { requestRefund } from "../domain/refund.js";
import type { PaymentProposal } from "../domain/proposal.js";
import type { PaymentRail } from "../domain/rail.js";
import { DomainError } from "../domain/types.js";
import type { DataStore } from "../persistence/store.js";
import { AuditIdSeq } from "./audit-id.js";

export class RefundService {
  private readonly auditIds = new AuditIdSeq("r");

  constructor(
    private readonly store: DataStore,
    private readonly rail: PaymentRail,
  ) {}

  async requestRefund(
    proposalId: string,
    principalId: string,
  ): Promise<PaymentProposal> {
    const current = this.store.getProposal(proposalId);
    if (!current) {
      throw new DomainError(`Proposal ${proposalId} not found`);
    }

    const next = await requestRefund(
      current,
      this.rail,
      this.store.audit,
      {
        actor: { kind: "principal", id: principalId },
        auditId: this.auditIds.next("refund"),
      },
    );
    this.store.saveProposal(next);
    return next;
  }
}
