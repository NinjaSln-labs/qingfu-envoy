import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { handleApi } from "./api.js";
import { openWebContext } from "./context.js";

describe("web list (P0-13 IA)", () => {
  it("lists envoys and proposals via API", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-web-"));
    const ctx = await openWebContext(dir);
    ctx.proposals.registerEnvoy("e1", "demo");
    ctx.proposals.proposePayment(
      {
        id: "p1",
        envoyId: "e1",
        money: { amount: "5", currency: "CNY" },
        purpose: "tea",
        payeeSummary: "shop",
      },
      { kind: "envoy", id: "e1" },
    );

    const envoys = await handleApi(ctx, {
      method: "GET",
      path: "/api/envoys",
    });
    expect(envoys.status).toBe(200);
    expect((envoys.body as { id: string }[]).some((e) => e.id === "e1")).toBe(
      true,
    );

    const all = await handleApi(ctx, {
      method: "GET",
      path: "/api/proposals",
    });
    expect(all.status).toBe(200);
    expect(
      (all.body as { id: string }[]).some((p) => p.id === "p1"),
    ).toBe(true);

    const filtered = await handleApi(ctx, {
      method: "GET",
      path: "/api/proposals?envoyId=e1",
    });
    expect((filtered.body as unknown[]).length).toBe(1);

    const detail = await handleApi(ctx, {
      method: "GET",
      path: "/api/proposals/p1",
    });
    expect((detail.body as { status: string }).status).toBe("proposed");

    const audit = await handleApi(ctx, {
      method: "GET",
      path: "/api/proposals/p1/audit",
    });
    expect(Array.isArray(audit.body)).toBe(true);
  });

  it("approve → execute → refund via API", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-web-"));
    const ctx = await openWebContext(dir);
    ctx.proposals.registerEnvoy("e1", "demo");
    ctx.proposals.proposePayment(
      {
        id: "p2",
        envoyId: "e1",
        money: { amount: "1", currency: "CNY" },
        purpose: "x",
        payeeSummary: "y",
      },
      { kind: "envoy", id: "e1" },
    );

    await handleApi(ctx, {
      method: "POST",
      path: "/api/proposals/p2/approve",
    });
    await handleApi(ctx, {
      method: "POST",
      path: "/api/proposals/p2/execute",
    });
    const refunded = await handleApi(ctx, {
      method: "POST",
      path: "/api/proposals/p2/refund",
    });
    expect((refunded.body as { status: string }).status).toBe("refunded");
  });

  it("reject, cancel, freeze, unfreeze, export via API", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qingfu-web-"));
    const ctx = await openWebContext(dir);
    ctx.proposals.registerEnvoy("e1", "demo");
    ctx.proposals.proposePayment(
      {
        id: "p3",
        envoyId: "e1",
        money: { amount: "2", currency: "CNY" },
        purpose: "a",
        payeeSummary: "b",
      },
      { kind: "envoy", id: "e1" },
    );

    const rejected = await handleApi(ctx, {
      method: "POST",
      path: "/api/proposals/p3/reject",
    });
    expect((rejected.body as { status: string }).status).toBe("rejected");

    ctx.proposals.proposePayment(
      {
        id: "p4",
        envoyId: "e1",
        money: { amount: "2", currency: "CNY" },
        purpose: "c",
        payeeSummary: "d",
      },
      { kind: "envoy", id: "e1" },
    );
    const cancelled = await handleApi(ctx, {
      method: "POST",
      path: "/api/proposals/p4/cancel",
    });
    expect((cancelled.body as { status: string }).status).toBe("cancelled");

    const frozen = await handleApi(ctx, {
      method: "POST",
      path: "/api/envoys/e1/freeze",
    });
    expect((frozen.body as { frozen: boolean }).frozen).toBe(true);

    const unfrozen = await handleApi(ctx, {
      method: "POST",
      path: "/api/envoys/e1/unfreeze",
    });
    expect((unfrozen.body as { frozen: boolean }).frozen).toBe(false);

    const exported = await handleApi(ctx, {
      method: "GET",
      path: "/api/export?proposalId=p3",
    });
    expect(Array.isArray(exported.body)).toBe(true);
  });
});
