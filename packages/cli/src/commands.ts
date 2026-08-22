import { DomainError } from "@qingfu/core";
import type { CliContext } from "./context.js";
import { exportJson, principalId } from "./context.js";

export type RunResult = { ok: true; message?: string } | { ok: false; error: string };

function fail(message: string): RunResult {
  return { ok: false, error: message };
}

function ok(message?: string): RunResult {
  return { ok: true, message };
}

function requireArg(args: Map<string, string>, key: string): string | RunResult {
  const v = args.get(key);
  if (!v?.trim()) {
    return fail(`missing required --${key}`);
  }
  return v.trim();
}

export function parseArgs(argv: string[]): {
  command: string;
  positional: string[];
  flags: Map<string, string>;
} {
  const flags = new Map<string, string>();
  const positional: string[] = [];
  let command = "";

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags.set(key, next);
        i += 1;
      } else {
        flags.set(key, "true");
      }
    } else if (!command) {
      command = a;
    } else {
      positional.push(a);
    }
  }

  return { command, positional, flags };
}

export async function runCommand(
  ctx: CliContext,
  argv: string[],
): Promise<RunResult> {
  const { command, positional, flags } = parseArgs(argv);

  if (!command || command === "help" || flags.get("help") === "true") {
    return ok(helpText());
  }

  try {
    switch (command) {
      case "envoy":
        return runEnvoy(ctx, positional, flags);
      case "propose":
        return await runPropose(ctx, flags);
      case "list":
        return runList(ctx, flags);
      case "approve":
        return runApprove(ctx, positional, flags);
      case "reject":
        return runReject(ctx, positional, flags);
      case "cancel":
        return runCancel(ctx, positional);
      case "execute":
        return await runExecute(ctx, positional);
      case "refund":
        return await runRefund(ctx, positional, flags);
      case "export":
        return runExport(ctx, flags);
      case "freeze":
        return runFreeze(ctx, flags);
      case "unfreeze":
        return runUnfreeze(ctx, flags);
      default:
        return fail(`unknown command: ${command}`);
    }
  } catch (err) {
    if (err instanceof DomainError) {
      return fail(err.message);
    }
    throw err;
  }
}

function runEnvoy(
  ctx: CliContext,
  positional: string[],
  flags: Map<string, string>,
): RunResult {
  const sub = positional[0];
  if (sub !== "register") {
    return fail("usage: envoy register <id> --name <displayName>");
  }
  const id = positional[1];
  if (!id) {
    return fail("usage: envoy register <id> --name <displayName>");
  }
  const name = flags.get("name");
  if (!name) {
    return fail("missing required --name");
  }
  const envoy = ctx.proposals.registerEnvoy(id, name);
  return ok(JSON.stringify(envoy, null, 2));
}

async function runPropose(
  ctx: CliContext,
  flags: Map<string, string>,
): Promise<RunResult> {
  const envoyId = requireArg(flags, "envoy");
  if (typeof envoyId !== "string") {
    return envoyId;
  }
  const id = requireArg(flags, "id");
  if (typeof id !== "string") {
    return id;
  }
  const amount = requireArg(flags, "amount");
  if (typeof amount !== "string") {
    return amount;
  }
  const currency = flags.get("currency")?.trim() || "CNY";
  const purpose = requireArg(flags, "purpose");
  if (typeof purpose !== "string") {
    return purpose;
  }
  const payee = requireArg(flags, "payee");
  if (typeof payee !== "string") {
    return payee;
  }

  const proposal = ctx.proposals.proposePayment(
    {
      id,
      envoyId,
      money: { amount, currency },
      purpose,
      payeeSummary: payee,
    },
    { kind: "envoy", id: envoyId },
  );
  return ok(JSON.stringify(proposal, null, 2));
}

function runList(ctx: CliContext, flags: Map<string, string>): RunResult {
  const envoyId = flags.get("envoy");
  const all = ctx.proposals.listProposals();
  const filtered = envoyId
    ? all.filter((p) => p.envoyId === envoyId)
    : all;
  return ok(JSON.stringify(filtered, null, 2));
}

function runApprove(
  ctx: CliContext,
  positional: string[],
  flags: Map<string, string>,
): RunResult {
  const id = positional[0];
  if (!id) {
    return fail("usage: approve <proposalId>");
  }
  const principal = flags.get("principal")?.trim() || principalId();
  const next = ctx.proposals.approveProposal(id, principal);
  return ok(JSON.stringify(next, null, 2));
}

function runReject(
  ctx: CliContext,
  positional: string[],
  flags: Map<string, string>,
): RunResult {
  const id = positional[0];
  if (!id) {
    return fail("usage: reject <proposalId>");
  }
  const principal = flags.get("principal")?.trim() || principalId();
  const next = ctx.proposals.rejectProposal(id, principal);
  return ok(JSON.stringify(next, null, 2));
}

function runCancel(ctx: CliContext, positional: string[]): RunResult {
  const id = positional[0];
  if (!id) {
    return fail("usage: cancel <proposalId>");
  }
  const proposal = ctx.proposals.getProposal(id);
  if (!proposal) {
    return fail(`Proposal ${id} not found`);
  }
  const next = ctx.proposals.cancelProposal(id, {
    kind: "envoy",
    id: proposal.envoyId,
  });
  return ok(JSON.stringify(next, null, 2));
}

async function runExecute(
  ctx: CliContext,
  positional: string[],
): Promise<RunResult> {
  const id = positional[0];
  if (!id) {
    return fail("usage: execute <proposalId>");
  }
  const next = await ctx.proposals.executeProposal(id, {
    kind: "principal",
    id: principalId(),
  });
  return ok(JSON.stringify(next, null, 2));
}

async function runRefund(
  ctx: CliContext,
  positional: string[],
  flags: Map<string, string>,
): Promise<RunResult> {
  const id = positional[0];
  if (!id) {
    return fail("usage: refund <proposalId>");
  }
  const principal = flags.get("principal")?.trim() || principalId();
  const next = await ctx.refunds.requestRefund(id, principal);
  return ok(JSON.stringify(next, null, 2));
}

function runExport(ctx: CliContext, flags: Map<string, string>): RunResult {
  const proposalId = flags.get("proposal");
  return ok(exportJson(ctx, proposalId));
}

function runFreeze(ctx: CliContext, flags: Map<string, string>): RunResult {
  const envoyId = requireArg(flags, "envoy");
  if (typeof envoyId !== "string") {
    return envoyId;
  }
  const principal = flags.get("principal")?.trim() || principalId();
  const envoy = ctx.proposals.freezeEnvoy(envoyId, principal);
  return ok(JSON.stringify(envoy, null, 2));
}

function runUnfreeze(ctx: CliContext, flags: Map<string, string>): RunResult {
  const envoyId = requireArg(flags, "envoy");
  if (typeof envoyId !== "string") {
    return envoyId;
  }
  const principal = flags.get("principal")?.trim() || principalId();
  const envoy = ctx.proposals.unfreezeEnvoy(envoyId, principal);
  return ok(JSON.stringify(envoy, null, 2));
}

function helpText(): string {
  return `qingfu — Qingfu Envoy principal CLI (Mock rail)

Commands:
  envoy register <id> --name <name>
  propose --envoy <id> --id <proposalId> --amount <amt> --purpose <text> --payee <text> [--currency CNY]
  list [--envoy <id>]
  approve <proposalId> [--principal <id>]
  reject <proposalId> [--principal <id>]
  cancel <proposalId>
  execute <proposalId>
  refund <proposalId> [--principal <id>]
  export [--proposal <proposalId>]
  freeze --envoy <id> [--principal <id>]
  unfreeze --envoy <id> [--principal <id>]

Env: QINGFU_DATA_DIR, QINGFU_PRINCIPAL_ID (default local-principal)
`;
}
