<div align="center">

# 青蚨使 · Qingfu Envoy

> **潮平两岸阔，风正一帆悬** · *Smooth Sailing*
> 开源 **Agent 付款控制面**：Envoy **提议** → 主理人 **确认** → 持牌通道 **执行**。

[![Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-62%2B1%20skip-green)](package.json)
[![V1 Slice](https://img.shields.io/badge/V1%20Slice-S1%E2%80%93S5-brightgreen)](ROADMAP.md)
[![No Silent Pay](https://img.shields.io/badge/No%20Silent%20Pay-ADR%20001-success)](docs/decisions/001-no-license-no-silent-pay.md)

**[English](README.en.md)** | 中文

</div>

---

## 简介

**青蚨使（Qingfu Envoy）**——「青蚨」古喻金钱；**使** = 持节使者（Envoy）：Agent 只能**提议**，主理人**确认**后，才由支付宝等**持牌通道**搬运资金。

- **一句话目标**：让个人开发者把 Agent 付款关在「**提议 → 你确认 → 再执行**」里，可审计、可急停、可退款请求。
- **全球定位对位**：大厂多把扣款藏在封闭钱包里；青蚨使服务「**不敢把扣款权交给黑盒自动化**」的人——差异化 = **人确认默认 × 开源自托管 × 完整审计链**。
- **护城河**：控制面与信任（提议可见、禁静默路径、主理人动作）；我们不是支付机构，不碰清算备付金（[ADR 001](docs/decisions/001-no-license-no-silent-pay.md)）。
- **一核多壳**：`@qingfu/core` 领域核 + CLI / MCP / Web 适配器 + Mock / 支付宝轨适配器。
- **轨策略**：V1 Mock 可 dogfood；`@qingfu/rails-alipay` 对接 sandbox（env 可 skip）。

## 当前状态

| 域 | 状态 |
|----|------|
| 产品规格 `docs/product/` | ✅ PRD · D8 · launch 清单 |
| S1–S5 垂直切片 | ✅ core · CLI · MCP · Web · rails-alipay |
| 契约测试 | ✅ `npm test` 62 绿 + 1 skip（sandbox 无 env） |
| Mock dogfood | ✅ ≥20 笔允准（[周记](docs/delivery/dogfood-journal.md)） |
| 下一门禁 | V1 标签 → Private beta（放心拍延后至邀请试用） |

**路线图：** [ROADMAP.md](ROADMAP.md)

## 目录结构

| 目录/包 | 内容 |
|---------|------|
| `packages/core` | 领域核：提议生命周期 · 审计 · Mock 轨 · JSON 持久化 |
| `packages/cli` | 主理人 CLI `qingfu` |
| `packages/mcp` | Envoy MCP 工具（**无 blind execute**） |
| `packages/web` | 本地任务面（127.0.0.1） |
| `packages/rails-alipay` | 支付宝 OpenAPI `PaymentRail` 适配器 |
| `docs/` | PRD · 架构 · stage-spec · ADR · 交付索引 |
| `scripts/dogfood-cli-mock*.sh` | Mock 回放 / 批量 dogfood |

## 快速开始

```bash
git clone https://github.com/NinjaSln-labs/qingfu-envoy.git
cd qingfu-envoy
npm install && npm run build && npm test
```

**10 分钟 Mock（CLI）：**

```bash
node packages/cli/dist/cli.js envoy register agent-1 --name demo
node packages/cli/dist/cli.js propose --envoy agent-1 --id p1 --amount 1.00 --purpose test --payee shop
node packages/cli/dist/cli.js approve p1
node packages/cli/dist/cli.js execute p1
node packages/cli/dist/cli.js export --proposal p1
```

| 端 | 文档 |
|----|------|
| CLI | [packages/cli/README.md](packages/cli/README.md) |
| MCP | [packages/mcp/README.md](packages/mcp/README.md) |
| Web | [packages/web/README.md](packages/web/README.md) |

数据目录默认 `~/.qingfu-envoy/`（`QINGFU_DATA_DIR`）。

## 文档

| 文档 | 说明 |
|------|------|
| [ROADMAP](ROADMAP.md) | 里程碑与 V1 范围 |
| [PRD](docs/product/prd.md) | 产品范围权威 |
| [实施计划](docs/design/implementation-plan-v1.md) | 任务级计划 |
| [文档索引](docs/README.md) | 全量链接 |
| [Contributing](CONTRIBUTING.md) | 贡献流程 |
| [Security](SECURITY.md) | 安全报告 |

## Git

- 分支 `main`；PR 须绿 `npm test`；支付相关变更对照 ADR 001、004。

## License

[Apache-2.0](LICENSE) © NinjaSln-labs
