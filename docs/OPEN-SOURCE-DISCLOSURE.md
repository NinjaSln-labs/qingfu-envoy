# 开源计划披露说明 · Plan Disclosure

> 对外权威路线图：[ROADMAP.md](../../ROADMAP.md)（仓库根目录）  
> 本文说明「披露什么、在哪里、如何更新」，供维护者与审计对照。

## 披露原则

1. **单一真相**：路线图状态只认 ROADMAP 里程碑表 + stage-spec DoD 勾选，不认 Chat/私下承诺。  
2. **决策可追溯**：边界变化必须 [ADR](decisions/000-decision-log.md)，并在 ROADMAP 表更新。  
3. **计划可审**：实施计划与审计报告常驻仓库，不藏私有排期表。  
4. **反静默承诺**：任何免确认扣款能力须新 ADR + ROADMAP 显式列入；否则视为违规范围蔓延。

## 披露物清单

| 类别 | 路径 | 更新时机 |
|------|------|----------|
| 路线图 | `/ROADMAP.md` | 里程碑状态变更、V1.1+ 项增减 |
| 产品范围 | `product/prd.md` | 范围裁定 |
| 指标 | `product/success-metrics.md` | 指标变更 |
| 实施计划 | `design/implementation-plan-v1.md` | 任务级变更 |
| 计划审计 | `design/IMPLEMENTATION-PLAN-AUDIT.md` | 计划大改后复审 |
| 阶段契约 | `design/stage-specs/S*.md` | 阶段 DoD 变更 |
| 决策 | `decisions/*.md` | 每次裁定 |
| 产品文档审计 | `product/PRODUCT-DOC-AUDIT.md` | 规格大改后 |
| 发布 | `product/launch-plan.md` | 首发前 |

## 当前披露状态（2026-08-22）

- ROADMAP：✅ 已发布  
- V1 做/不做：✅ 见 ROADMAP + PRD  
- 实施计划全文：✅ 公开  
- 代码进度：🚧 诚实标注「未发布 / S1 未开工」

## 与 GitHub 的衔接

| 项 | 路径 / 说明 | 状态 |
|----|-------------|------|
| Milestone | M0–M5、V1（对齐 ROADMAP 表） | ✅ 远程已建 |
| Issue 模板 | `.github/ISSUE_TEMPLATE/` | ✅ |
| PR 模板 | `.github/pull_request_template.md` | ✅ |
| 贡献指南 | `/CONTRIBUTING.md` | ✅ |
| 安全策略 | `/SECURITY.md` | ✅ |
| 标签 | `S1`…`S5`、`adr`、`security`、`documentation` | ✅ |
| Ticket Issues | `docs/delivery/tickets.md` → #1–#16 | ✅ |

Issue/PR 请标明阶段与 Ticket ID；Release 仅当 V1 launch 检查清单满足后打 tag。
