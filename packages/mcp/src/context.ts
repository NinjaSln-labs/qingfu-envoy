import {
  createMockRail,
  JsonStore,
  ProposalService,
  RefundService,
} from "@qingfu/core";

export type McpContext = {
  store: JsonStore;
  proposals: ProposalService;
  refunds: RefundService;
};

export async function openMcpContext(
  dataDir?: string,
): Promise<McpContext> {
  const store = await JsonStore.open(dataDir);
  const rail = createMockRail();
  return {
    store,
    proposals: new ProposalService(store, rail),
    refunds: new RefundService(store, rail),
  };
}
