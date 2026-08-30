import {
  exportAuditJson,
  JsonStore,
  ProposalService,
  RefundService,
} from "@qingfu/core";
import {
  defaultRailName,
  resolvePaymentRail,
  type RailName,
} from "./rail.js";

export type CliContext = {
  store: JsonStore;
  proposals: ProposalService;
  refunds: RefundService;
  railName: RailName;
};

export async function openCliContext(
  dataDir?: string,
  railName: RailName = defaultRailName(),
): Promise<CliContext> {
  const store = await JsonStore.open(dataDir);
  const rail = resolvePaymentRail(railName);
  return {
    store,
    proposals: new ProposalService(store, rail),
    refunds: new RefundService(store, rail),
    railName,
  };
}

/** Rebind execute/refund services to another rail (same store). */
export function withRail(ctx: CliContext, railName: RailName): CliContext {
  if (railName === ctx.railName) {
    return ctx;
  }
  const rail = resolvePaymentRail(railName);
  return {
    store: ctx.store,
    proposals: new ProposalService(ctx.store, rail),
    refunds: new RefundService(ctx.store, rail),
    railName,
  };
}

export function principalId(): string {
  return process.env.QINGFU_PRINCIPAL_ID?.trim() || "local-principal";
}

export function exportJson(
  ctx: CliContext,
  proposalId?: string,
): string {
  return exportAuditJson(ctx.store.audit, proposalId);
}
