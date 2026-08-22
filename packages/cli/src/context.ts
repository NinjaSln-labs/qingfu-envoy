import {
  createMockRail,
  exportAuditJson,
  JsonStore,
  ProposalService,
  RefundService,
} from "@qingfu/core";

export type CliContext = {
  store: JsonStore;
  proposals: ProposalService;
  refunds: RefundService;
};

export async function openCliContext(
  dataDir?: string,
): Promise<CliContext> {
  const store = await JsonStore.open(dataDir);
  const rail = createMockRail();
  return {
    store,
    proposals: new ProposalService(store, rail),
    refunds: new RefundService(store, rail),
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
