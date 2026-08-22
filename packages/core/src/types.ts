export type Money = {
  amount: string;
  currency: string;
};

export type ProposalStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "cancelled"
  | "executed"
  | "failed";

export type Actor =
  | { kind: "principal"; id: string }
  | { kind: "envoy"; id: string }
  | { kind: "system" };

export type AuditEvent = {
  id: string;
  proposalId: string;
  at: string;
  actor: Actor;
  action: string;
  from: ProposalStatus | null;
  to: ProposalStatus;
  detail?: Record<string, unknown>;
};

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
