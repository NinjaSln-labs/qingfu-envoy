import { DomainError } from "@qingfu/core";
import type { WebContext } from "./context.js";
import { exportJson, principalId } from "./context.js";

export type ApiRequest = {
  method: string;
  path: string;
  body?: unknown;
};

export type ApiResponse = {
  status: number;
  body: unknown;
};

function json(status: number, body: unknown): ApiResponse {
  return { status, body };
}

function err(message: string, status = 400): ApiResponse {
  return json(status, { error: message });
}

function parseBody(body: unknown): Record<string, unknown> {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    return body as Record<string, unknown>;
  }
  return {};
}

function requireString(
  data: Record<string, unknown>,
  key: string,
): string | ApiResponse {
  const v = data[key];
  if (typeof v !== "string" || !v.trim()) {
    return err(`missing or invalid ${key}`);
  }
  return v.trim();
}

function parsePath(path: string): { pathname: string; searchParams: URLSearchParams } {
  const url = new URL(path, "http://local");
  return { pathname: url.pathname, searchParams: url.searchParams };
}

function segments(pathname: string): string[] {
  return pathname.replace(/\/+$/, "").split("/").filter(Boolean);
}

export async function handleApi(
  ctx: WebContext,
  req: ApiRequest,
): Promise<ApiResponse> {
  try {
    const { method } = req;
    const { pathname, searchParams } = parsePath(req.path);
    const parts = segments(pathname);
    const joined = parts.join("/");

    if (method === "GET" && joined === "api/envoys") {
      return json(200, ctx.store.listEnvoys());
    }

    if (method === "GET" && joined === "api/proposals") {
      const envoyId = searchParams.get("envoyId") ?? undefined;
      const all = ctx.proposals.listProposals();
      const rows = envoyId
        ? all.filter((p) => p.envoyId === envoyId)
        : all;
      return json(200, rows);
    }

    if (
      method === "GET" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      !parts[3]
    ) {
      const proposal = ctx.proposals.getProposal(parts[2]);
      if (!proposal) {
        return err(`Proposal ${parts[2]} not found`, 404);
      }
      return json(200, proposal);
    }

    if (
      method === "GET" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      parts[3] === "audit"
    ) {
      const proposalId = parts[2];
      const proposal = ctx.proposals.getProposal(proposalId);
      if (!proposal) {
        return err(`Proposal ${parts[2]} not found`, 404);
      }
      const events = JSON.parse(exportJson(ctx, proposalId));
      return json(200, events);
    }

    if (method === "GET" && joined === "api/export") {
      const proposalId = searchParams.get("proposalId") ?? undefined;
      const text = exportJson(ctx, proposalId);
      return json(200, JSON.parse(text));
    }

    if (method === "POST" && joined === "api/envoys") {
      const data = parseBody(req.body);
      const id = requireString(data, "id");
      if (typeof id !== "string") {
        return id;
      }
      const name = requireString(data, "name");
      if (typeof name !== "string") {
        return name;
      }
      const envoy = ctx.proposals.registerEnvoy(id, name);
      return json(201, envoy);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      parts[3] === "approve"
    ) {
      const next = ctx.proposals.approveProposal(parts[2], principalId());
      return json(200, next);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      parts[3] === "reject"
    ) {
      const next = ctx.proposals.rejectProposal(parts[2], principalId());
      return json(200, next);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      parts[3] === "cancel"
    ) {
      const proposal = ctx.proposals.getProposal(parts[2]);
      if (!proposal) {
        return err(`Proposal ${parts[2]} not found`, 404);
      }
      const next = ctx.proposals.cancelProposal(parts[2], {
        kind: "envoy",
        id: proposal.envoyId,
      });
      return json(200, next);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      parts[3] === "execute"
    ) {
      const next = await ctx.proposals.executeProposal(parts[2], {
        kind: "principal",
        id: principalId(),
      });
      return json(200, next);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "proposals" &&
      parts[2] &&
      parts[3] === "refund"
    ) {
      const next = await ctx.refunds.requestRefund(parts[2], principalId());
      return json(200, next);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "envoys" &&
      parts[2] &&
      parts[3] === "freeze"
    ) {
      const envoy = ctx.proposals.freezeEnvoy(parts[2], principalId());
      return json(200, envoy);
    }

    if (
      method === "POST" &&
      parts[0] === "api" &&
      parts[1] === "envoys" &&
      parts[2] &&
      parts[3] === "unfreeze"
    ) {
      const envoy = ctx.proposals.unfreezeEnvoy(parts[2], principalId());
      return json(200, envoy);
    }

    return err("not found", 404);
  } catch (e) {
    if (e instanceof DomainError) {
      return err(e.message, 400);
    }
    throw e;
  }
}
