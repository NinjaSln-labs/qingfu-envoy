#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { openMcpContext } from "./context.js";
import { createMcpServer } from "./register-tools.js";

async function main(): Promise<void> {
  const ctx = await openMcpContext();
  const server = createMcpServer(ctx);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
