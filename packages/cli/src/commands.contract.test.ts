import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { JsonStore } from "@qingfu/core";
import { runCommand } from "./commands.js";
import { openCliContext } from "./context.js";

async function freshCtx(): Promise<{ ctx: Awaited<ReturnType<typeof openCliContext>>; dir: string }> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-cli-contract-"));
  const ctx = await openCliContext(dir);
  return { ctx, dir };
}

async function seedProposed(ctx: Awaited<ReturnType<typeof openCliContext>>, id = "p1") {
  await runCommand(ctx, ["envoy", "register", "e1", "--name", "demo"]);
  await runCommand(ctx, [
    "propose",
    "--envoy",
    "e1",
    "--id",
    id,
    "--amount",
    "3.00",
    "--purpose",
    "x",
    "--payee",
    "y",
  ]);
}

describe("cli command contract (P0-11)", () => {
  it("help lists commands (smoke)", async () => {
    const { ctx } = await freshCtx();
    const r = await runCommand(ctx, ["help"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("qingfu");
    expect(r.message).toContain("propose");
  });

  it("list shows proposals", async () => {
    const { ctx } = await freshCtx();
    await seedProposed(ctx);
    const r = await runCommand(ctx, ["list"]);
    expect(r.ok).toBe(true);
    const rows = JSON.parse(r.message!);
    expect(rows.some((p: { id: string }) => p.id === "p1")).toBe(true);
  });

  it("reject from proposed", async () => {
    const { ctx } = await freshCtx();
    await seedProposed(ctx);
    const r = await runCommand(ctx, ["reject", "p1"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("rejected");
  });

  it("cancel from proposed", async () => {
    const { ctx } = await freshCtx();
    await seedProposed(ctx);
    const r = await runCommand(ctx, ["cancel", "p1"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("cancelled");
  });

  it("unfreeze after freeze allows propose", async () => {
    const { ctx } = await freshCtx();
    await runCommand(ctx, ["envoy", "register", "e1", "--name", "demo"]);
    await runCommand(ctx, ["freeze", "--envoy", "e1"]);
    await runCommand(ctx, ["unfreeze", "--envoy", "e1"]);
    const r = await runCommand(ctx, [
      "propose",
      "--envoy",
      "e1",
      "--id",
      "p3",
      "--amount",
      "1.00",
      "--purpose",
      "x",
      "--payee",
      "y",
    ]);
    expect(r.ok).toBe(true);
  });

  it("cancel while frozen (P0-6 via CLI)", async () => {
    const { ctx } = await freshCtx();
    await seedProposed(ctx);
    await runCommand(ctx, ["freeze", "--envoy", "e1"]);
    const r = await runCommand(ctx, ["cancel", "p1"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("cancelled");
  });

  it("execute without approve fails", async () => {
    const { ctx } = await freshCtx();
    await seedProposed(ctx);
    const r = await runCommand(ctx, ["execute", "p1"]);
    expect(r.ok).toBe(false);
  });

  it("rejects illegal amount", async () => {
    const { ctx } = await freshCtx();
    await runCommand(ctx, ["envoy", "register", "e1", "--name", "demo"]);
    const r = await runCommand(ctx, [
      "propose",
      "--envoy",
      "e1",
      "--id",
      "bad",
      "--amount",
      "abc",
      "--purpose",
      "x",
      "--payee",
      "y",
    ]);
    expect(r.ok).toBe(false);
  });

  it("persists data across JsonStore reopen", async () => {
    const { ctx, dir } = await freshCtx();
    await seedProposed(ctx);
    await runCommand(ctx, ["approve", "p1"]);

    const reopened = await JsonStore.open(dir);
    expect(reopened.getProposal("p1")?.status).toBe("approved");
  });
});
