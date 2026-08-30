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

export type WebContext = {
  store: JsonStore;
  proposals: ProposalService;
  refunds: RefundService;
  railName: RailName;
};

export async function openWebContext(
  dataDir?: string,
  railName: RailName = defaultRailName(),
): Promise<WebContext> {
  const store = await JsonStore.open(dataDir);
  const rail = resolvePaymentRail(railName);
  return {
    store,
    proposals: new ProposalService(store, rail),
    refunds: new RefundService(store, rail),
    railName,
  };
}

export function principalId(): string {
  return process.env.QINGFU_PRINCIPAL_ID?.trim() || "local-principal";
}

export function webHost(): string {
  return process.env.QINGFU_WEB_HOST?.trim() || "127.0.0.1";
}

export function webPort(): number {
  const raw = process.env.QINGFU_WEB_PORT?.trim();
  return raw ? Number.parseInt(raw, 10) : 3920;
}

export function exportJson(
  ctx: WebContext,
  proposalId?: string,
): string {
  return exportAuditJson(ctx.store.audit, proposalId);
}
