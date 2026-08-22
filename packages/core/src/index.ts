export type { Money, ProposalStatus, Actor, AuditEvent } from "./types.js";
export { DomainError } from "./types.js";

export {
  createEnvoy,
  freeze,
  unfreeze,
  assertCanPropose,
  type Envoy,
} from "./envoy.js";

export {
  propose,
  approve,
  reject,
  cancel,
  markExecuted,
  markFailed,
  type PaymentProposal,
  type ProposeInput,
} from "./proposal.js";

export {
  createMemoryAuditSink,
  recordTransition,
  type AuditSink,
} from "./audit.js";

export {
  createMockRail,
  type PaymentRail,
  type RailIntent,
  type RailResult,
} from "./rail.js";

export { executeApproved } from "./execution.js";
