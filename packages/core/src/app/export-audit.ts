import type { AuditSink } from "../domain/audit.js";

export function exportAuditJson(
  sink: AuditSink,
  proposalId?: string,
): string {
  const events = sink.list(proposalId);
  return JSON.stringify(events, null, 2);
}
