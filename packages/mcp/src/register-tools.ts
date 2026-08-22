import { DomainError } from "@qingfu/core";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { McpContext } from "./context.js";
import {
  handleCancel,
  handleGet,
  handleList,
  handlePropose,
  handleStatus,
} from "./handlers.js";
import { ENVOY_TOOL_NAMES } from "./tools.js";

function textResult(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function toolError(message: string) {
  return {
    content: [{ type: "text" as const, text: message }],
    isError: true as const,
  };
}

function wrap<T>(fn: () => T) {
  try {
    return textResult(fn());
  } catch (err) {
    if (err instanceof DomainError) {
      return toolError(err.message);
    }
    throw err;
  }
}

/** Thin adapter: MCP SDK + Zod overloads exceed TS depth; handlers stay fully typed. */
type ToolServer = {
  tool(
    name: string,
    description: string,
    schema: Record<string, z.ZodTypeAny>,
    handler: (
      args: Record<string, string | undefined>,
    ) => Promise<ReturnType<typeof wrap>>,
  ): void;
};

export function createMcpServer(ctx: McpContext): McpServer {
  const server = new McpServer({
    name: "qingfu-envoy",
    version: "0.0.1",
  });
  const tools = server as unknown as ToolServer;

  tools.tool(
    "envoy_propose",
    "Create a payment proposal (Envoy actor). Requires principal approval before execution.",
    {
      envoyId: z.string().min(1),
      proposalId: z.string().min(1),
      amount: z.string().min(1),
      currency: z.string().optional(),
      purpose: z.string().min(1),
      payee: z.string().min(1),
    },
    async (args) =>
      wrap(() =>
        handlePropose(ctx, {
          envoyId: args.envoyId!,
          proposalId: args.proposalId!,
          amount: args.amount!,
          currency: args.currency,
          purpose: args.purpose!,
          payee: args.payee!,
        }),
      ),
  );

  tools.tool(
    "envoy_list",
    "List payment proposals, optionally filtered by envoyId.",
    { envoyId: z.string().optional() },
    async (args) => wrap(() => handleList(ctx, { envoyId: args.envoyId })),
  );

  tools.tool(
    "envoy_get",
    "Get a single proposal by id.",
    { proposalId: z.string().min(1) },
    async (args) =>
      wrap(() => handleGet(ctx, { proposalId: args.proposalId! })),
  );

  tools.tool(
    "envoy_cancel",
    "Cancel a proposed payment (Envoy actor, proposed state only).",
    { proposalId: z.string().min(1) },
    async (args) =>
      wrap(() => handleCancel(ctx, { proposalId: args.proposalId! })),
  );

  tools.tool(
    "envoy_status",
    "Poll proposal status (proposed / approved / executed / etc.).",
    { proposalId: z.string().min(1) },
    async (args) =>
      wrap(() => handleStatus(ctx, { proposalId: args.proposalId! })),
  );

  return server;
}

export function registeredToolNames(): readonly string[] {
  return ENVOY_TOOL_NAMES;
}
