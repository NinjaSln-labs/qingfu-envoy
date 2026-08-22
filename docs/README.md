# 文档中心 · Qingfu Envoy

> 对外路线图：[ROADMAP.md](../ROADMAP.md) · 披露维护：[OPEN-SOURCE-DISCLOSURE.md](./OPEN-SOURCE-DISCLOSURE.md)

## 按角色

| 角色 | 入口 |
|------|------|
| 访客 / Star 前 | [README](../README.md) → [ROADMAP](../ROADMAP.md) |
| 产品 / 范围 | [product/prd.md](./product/prd.md) |
| 贡献者 | [CONTRIBUTING.md](../CONTRIBUTING.md) → [tickets](./delivery/tickets.md) |
| 安全 | [SECURITY.md](../SECURITY.md) |
| 维护者交接 | [HANDOFF.md](../HANDOFF.md) |

## 目录

| 目录 | 内容 |
|------|------|
| [product/](./product/README.md) | PRD、指标、0→1 路径、launch |
| [design/](./design/stage-plan.md) | 领域、架构、实施计划、stage-spec |
| [decisions/](./decisions/000-decision-log.md) | ADR 裁定 |
| [delivery/](./delivery/tickets.md) | Ticket 索引 · [dogfood 周记](./delivery/dogfood-journal.md) |
| [research/](./research/2026-08-22-agentic-payment-capability-landscape.md) | 行业景观（非 V1 承诺） |

## 阅读序（0→1）

完整序号见 [product/README.md](./product/README.md)。最短路径：

1. [0→1 路径](./product/0-1-path.md) — 过程纪律  
2. [PRD](./product/prd.md) — 范围权威  
3. [实施计划](./design/implementation-plan-v1.md) — 任务级计划  
4. [stage-specs](./design/stage-specs/) — 阶段 DoD  

## 文档 vs 代码

- **S0** = 计划文档（已完成）  
- **S1–S5** = 代码阶段；进度以 ROADMAP 里程碑 + stage-spec 勾选为准  
- `packages/core` 当前为探索骨架，**S1 授权后**才与计划对齐  
