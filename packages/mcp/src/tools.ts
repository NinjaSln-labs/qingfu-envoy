/** Envoy-facing MCP tools (P0-12). Principal actions stay on CLI/Web. */
export const ENVOY_TOOL_NAMES = [
  "envoy_propose",
  "envoy_list",
  "envoy_get",
  "envoy_cancel",
  "envoy_status",
] as const;

export type EnvoyToolName = (typeof ENVOY_TOOL_NAMES)[number];

/** Must never appear as MCP tool names — no blind execute / principal bypass. */
export const FORBIDDEN_TOOL_SUBSTRINGS = [
  "execute",
  "approve",
  "reject",
  "refund",
  "freeze",
  "unfreeze",
  "export",
] as const;

export function assertNoBlindTools(names: readonly string[]): void {
  for (const name of names) {
    const lower = name.toLowerCase();
    for (const forbidden of FORBIDDEN_TOOL_SUBSTRINGS) {
      if (lower.includes(forbidden)) {
        throw new Error(`forbidden MCP tool name: ${name}`);
      }
    }
  }
}

assertNoBlindTools(ENVOY_TOOL_NAMES);
