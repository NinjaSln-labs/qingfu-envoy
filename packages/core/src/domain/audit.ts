import type { Actor, AuditEvent, AuditScope, ProposalStatus } from "./types.js";

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
      if (!proposalId) {
        return [...events];
      }
      return events.filter(
        (e) => e.scope === "proposal" && e.proposalId === proposalId,
      );
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
    scope?: AuditScope;
  },
): AuditEvent {
  const event: AuditEvent = {
    id: input.id,
    scope: input.scope ?? "proposal",
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

export function recordEnvoyAction(
  sink: AuditSink,
  input: {
    id: string;
    envoyId: string;
    actor: Actor;
    action: string;
    detail?: Record<string, unknown>;
    at?: string;
  },
): AuditEvent {
  const event: AuditEvent = {
    id: input.id,
    scope: "envoy",
    proposalId: input.envoyId,
    at: input.at ?? new Date().toISOString(),
    actor: input.actor,
    action: input.action,
    from: null,
    to: null,
    detail: input.detail,
  };
  sink.append(event);
  return event;
}
