export type { ProposalStatus, Actor, AuditEvent, AuditScope } from "./domain/types.js";
export { DomainError } from "./domain/types.js";
export type { Money } from "./domain/money.js";
export { parseMoney, assertValidMoney } from "./domain/money.js";

export {
  createEnvoy,
  freeze,
  unfreeze,
  assertCanPropose,
  type Envoy,
} from "./domain/envoy.js";

export {
  propose,
  approve,
  reject,
  cancel,
  markExecuted,
  markFailed,
  markRefunded,
  markRefundFailed,
  type PaymentProposal,
  type ProposeInput,
} from "./domain/proposal.js";

export {
  createMemoryAuditSink,
  recordTransition,
  recordEnvoyAction,
  type AuditSink,
} from "./domain/audit.js";

export {
  createMockRail,
  type PaymentRail,
  type RailIntent,
  type RailResult,
  type RefundIntent,
  type RefundResult,
} from "./domain/rail.js";

export { executeApproved } from "./domain/execution.js";
export { PaymentExecutionService } from "./domain/payment-execution-service.js";
export { requestRefund } from "./domain/refund.js";

export { ProposalService } from "./app/proposal-service.js";
export { RefundService } from "./app/refund-service.js";
export { exportAuditJson } from "./app/export-audit.js";

export {
  createMemoryStore,
  createPersistingAuditSink,
  type DataStore,
} from "./persistence/store.js";
export { JsonStore, defaultDataDir } from "./persistence/json-store.js";
