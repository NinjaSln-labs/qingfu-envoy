<div align="center">

# Qingfu Envoy · 青蚨使

> *Smooth Sailing* · **潮平两岸阔，风正一帆悬**
> Open-source **agent payment control plane**: Envoy **proposes** → principal **approves** → licensed rail **executes**.

[![Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-62%2B1%20skip-green)](package.json)
[![V1 Slice](https://img.shields.io/badge/V1%20Slice-S1%E2%80%93S5-brightgreen)](ROADMAP.md)
[![No Silent Pay](https://img.shields.io/badge/No%20Silent%20Pay-ADR%20001-success)](docs/decisions/001-no-license-no-silent-pay.md)

中文 | **[English](README.en.md)**

</div>

---

## About

**Qingfu Envoy (青蚨使)** — an open-source control plane for agent-initiated payments. Agents **propose**; humans **approve**; licensed rails (Alipay sandbox first) **execute**. We are **not** a payment institution and **forbid silent auto-pay** ([ADR 001](docs/decisions/001-no-license-no-silent-pay.md)).

- **One-line goal**: personal developers keep agent spending inside **propose → you approve → execute**, with audit export, freeze, and refund requests.
- **Positioning**: unlike closed-wallet agent pay, we target builders who **won’t hand debit authority to a black box** — **human approval by default × self-hosted × full audit trail**.
- **Architecture**: `@qingfu/core` domain kernel + CLI / MCP / Web adapters + Mock / Alipay rails.
- **V1 status**: S1–S5 shipped; mock dogfood ≥20 approvals; next: V1 tag → private beta.

## Status

| Area | Status |
|------|--------|
| Specs `docs/product/` | ✅ |
| S1–S5 vertical slice | ✅ |
| Tests | ✅ 62 pass + 1 skip |
| Mock dogfood | ✅ 21 approvals logged |

See [ROADMAP.md](ROADMAP.md).

## Layout

| Path | Purpose |
|------|---------|
| `packages/core` | Domain kernel |
| `packages/cli` | Principal CLI `qingfu` |
| `packages/mcp` | Envoy MCP tools (no blind execute) |
| `packages/web` | Local task UI (127.0.0.1) |
| `packages/rails-alipay` | Alipay `PaymentRail` adapter |

## Quick start

```bash
npm install && npm run build && npm test
node packages/cli/dist/cli.js help
```

Full dogfood paths: [packages/cli/README.md](packages/cli/README.md).

## Docs

| Doc | |
|-----|---|
| [ROADMAP](ROADMAP.md) | Milestones |
| [PRD](docs/product/prd.md) | Scope |
| [docs/README.md](docs/README.md) | Index |

## License

[Apache-2.0](LICENSE) © NinjaSln-labs
