import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { openMcpContext } from "./context.js";
import { handlePropose, handleStatus } from "./handlers.js";

describe("mcp e2e with CLI principal path", () => {
  it("MCP propose + principal approve/execute → status executed", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-mcp-e2e-"));
    const ctx = await openMcpContext(dir);
    ctx.proposals.registerEnvoy("e1", "demo");

    handlePropose(ctx, {
      envoyId: "e1",
      proposalId: "p-e2e",
      amount: "9.99",
      purpose: "demo",
      payee: "vendor",
    });

    let status = handleStatus(ctx, { proposalId: "p-e2e" });
    expect(status.status).toBe("proposed");

    ctx.proposals.approveProposal("p-e2e", "local-principal");
    status = handleStatus(ctx, { proposalId: "p-e2e" });
    expect(status.status).toBe("approved");

    await ctx.proposals.executeProposal("p-e2e", {
      kind: "principal",
      id: "local-principal",
    });
    status = handleStatus(ctx, { proposalId: "p-e2e" });
    expect(status.status).toBe("executed");
    expect(status.railRef).toBeTruthy();
  });
});
