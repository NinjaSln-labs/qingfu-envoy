export type ProposalStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "cancelled"
  | "executed"
  | "failed"
  | "refunded"
  | "refund_failed";

export type Actor =
  | { kind: "principal"; id: string }
  | { kind: "envoy"; id: string }
  | { kind: "system" };

/** `proposal` = payment lifecycle; `envoy` = freeze/unfreeze (proposalId holds envoy id). */
export type AuditScope = "proposal" | "envoy";

export type AuditEvent = {
  id: string;
  scope: AuditScope;
  proposalId: string;
  at: string;
  actor: Actor;
  action: string;
  from: ProposalStatus | null;
  to: ProposalStatus | null;
  detail?: Record<string, unknown>;
};

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
