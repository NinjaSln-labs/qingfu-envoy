# 青蚨使 · Qingfu Envoy

开源 **Agent 付款控制面**：Envoy **提议** → 主理人 **确认** → 持牌通道 **执行**（可退款请求）。  
不做支付牌照业务；**禁止静默自付**（[ADR 001](docs/decisions/001-no-license-no-silent-pay.md)）。

## 状态

**V1 垂直切片闭合**（S1 core → S2 CLI → S3 MCP → S4 Web → S5 支付宝适配器）。  
下一：**Dogfood**（[ADR 002](docs/decisions/002-dogfood-first.md)）→ [launch 清单](docs/product/launch-plan.md) → V1 标签。

**路线图：** [ROADMAP.md](ROADMAP.md)

## 三端 · 10 分钟 Mock Dogfood

共享数据目录：`~/.qingfu-envoy/`（或 `QINGFU_DATA_DIR`）。

| 端 | 文档 | 启动 |
|----|------|------|
| CLI | [packages/cli/README.md](packages/cli/README.md) | `node packages/cli/dist/cli.js help` |
| MCP | [packages/mcp/README.md](packages/mcp/README.md) | `node packages/mcp/dist/server.js` |
| Web | [packages/web/README.md](packages/web/README.md) | `node packages/web/dist/server.js` → http://127.0.0.1:3920 |

Dogfood 周记：[docs/delivery/dogfood-journal.md](docs/delivery/dogfood-journal.md)

## 文档

| 文档 | 说明 |
|------|------|
| [ROADMAP](ROADMAP.md) | 里程碑、V1 范围、计划披露 |
| [PRD](docs/product/prd.md) | 产品范围权威 |
| [实施计划](docs/design/implementation-plan-v1.md) | 任务级计划（公开） |
| [文档索引](docs/README.md) | 全量链接 |
| [Contributing](CONTRIBUTING.md) | 贡献流程 |
| [Security](SECURITY.md) | 安全报告 |

## 开发

```bash
npm install && npm run build && npm test
```

Workspaces：`@qingfu/core` · `@qingfu/cli` · `@qingfu/mcp` · `@qingfu/web` · `@qingfu/rails-alipay`

## 许可

Apache-2.0
