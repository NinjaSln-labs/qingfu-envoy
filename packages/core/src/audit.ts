import type { Actor, AuditEvent, ProposalStatus } from "./types.js";

export type AuditSink = {
  append(event: AuditEvent): void;
  list(proposalId?: string): AuditEvent[];
};

export function createMemoryAuditSink(): AuditSink {
  const events: AuditEvent[] = [];
  return {
    append(event) {
      events.push(event);
    },
    list(proposalId) {
      return proposalId
        ? events.filter((e) => e.proposalId === proposalId)
        : [...events];
    },
  };
}

export function recordTransition(
  sink: AuditSink,
  input: {
    id: string;
    proposalId: string;
    actor: Actor;
    action: string;
    from: ProposalStatus | null;
    to: ProposalStatus;
    detail?: Record<string, unknown>;
    at?: string;
  },
): AuditEvent {
  const event: AuditEvent = {
    id: input.id,
    proposalId: input.proposalId,
    at: input.at ?? new Date().toISOString(),
    actor: input.actor,
    action: input.action,
    from: input.from,
    to: input.to,
    detail: input.detail,
  };
  sink.append(event);
  return event;
}
