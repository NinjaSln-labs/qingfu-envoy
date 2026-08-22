import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { openMcpContext } from "./context.js";
import { handleList, handlePropose } from "./handlers.js";

describe("mcp propose", () => {
  it("creates a proposed payment via handler", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-mcp-"));
    const ctx = await openMcpContext(dir);
    ctx.proposals.registerEnvoy("e1", "demo");

    const proposal = handlePropose(ctx, {
      envoyId: "e1",
      proposalId: "p1",
      amount: "12.50",
      purpose: "lunch",
      payee: "cafe",
    });

    expect(proposal.status).toBe("proposed");
    expect(proposal.money.amount).toBe("12.50");

    const listed = handleList(ctx, { envoyId: "e1" });
    expect(listed.some((p) => p.id === "p1")).toBe(true);
  });

  it("rejects duplicate proposal id", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-mcp-"));
    const ctx = await openMcpContext(dir);
    ctx.proposals.registerEnvoy("e1", "demo");
    const input = {
      envoyId: "e1",
      proposalId: "dup",
      amount: "1",
      purpose: "x",
      payee: "y",
    };
    handlePropose(ctx, input);
    expect(() => handlePropose(ctx, input)).toThrow(/already exists/);
  });
});
