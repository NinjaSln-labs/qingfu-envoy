import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runCommand } from "./commands.js";
import { openCliContext } from "./context.js";

describe("cli happy path", () => {
  it("propose → approve → execute → export → refund on Mock rail", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-cli-"));
    const ctx = await openCliContext(dir);

    let r = await runCommand(ctx, [
      "envoy",
      "register",
      "e1",
      "--name",
      "demo",
    ]);
    expect(r.ok).toBe(true);

    r = await runCommand(ctx, [
      "propose",
      "--envoy",
      "e1",
      "--id",
      "p1",
      "--amount",
      "10.5",
      "--purpose",
      "coffee",
      "--payee",
      "cafe",
    ]);
    expect(r.ok).toBe(true);

    r = await runCommand(ctx, ["approve", "p1"]);
    expect(r.ok).toBe(true);

    r = await runCommand(ctx, ["execute", "p1"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("executed");

    r = await runCommand(ctx, ["export", "--proposal", "p1"]);
    expect(r.ok).toBe(true);
    const events = JSON.parse(r.message!);
    expect(events.some((e: { action: string }) => e.action === "execute")).toBe(
      true,
    );

    r = await runCommand(ctx, ["refund", "p1"]);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("refunded");
  });

  it("freeze blocks new propose via CLI", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-cli-"));
    const ctx = await openCliContext(dir);
    await runCommand(ctx, ["envoy", "register", "e1", "--name", "demo"]);
    await runCommand(ctx, ["freeze", "--envoy", "e1"]);

    const r = await runCommand(ctx, [
      "propose",
      "--envoy",
      "e1",
      "--id",
      "p2",
      "--amount",
      "1",
      "--purpose",
      "x",
      "--payee",
      "y",
    ]);
    expect(r.ok).toBe(false);
  });
});
