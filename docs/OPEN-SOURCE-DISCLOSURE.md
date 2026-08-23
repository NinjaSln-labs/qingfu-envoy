# 开源披露说明 · Plan Disclosure

> 对外路线图：[ROADMAP.md](../../ROADMAP.md)  
> 本文定义：**什么进仓库、什么仅维护者本地**。

## 披露原则

1. **默认公开**：影响开源项目**实际使用**或**按公开说明操作**（安装、运行、贡献、理解范围与边界）的文档与代码。  
2. **默认本地私有**：审计报告、过程笔记、调研、交付台账、工程交接、Agent 工具等**维护者材料**——**不入库**（`.gitignore`），除非维护者**主动要求披露**。  
3. **单一真相**：进度与范围以 ROADMAP + stage-spec DoD + PRD 为准，不认 Chat/私下承诺。  
4. **决策可追溯**：边界变化须 [ADR](decisions/000-decision-log.md)，并更新 ROADMAP。  
5. **反静默承诺**：免确认扣款须新 ADR + ROADMAP 显式列入。

## 公开披露物（仓库内）

| 类别 | 路径 | 用途 |
|------|------|------|
| 入门 | `/README.md`、`README.en.md` | 安装与定位 |
| 路线图 | `/ROADMAP.md` | 进度与 V1.1+ |
| 产品范围 | `product/prd.md` | 范围权威 |
| 指标 | `product/success-metrics.md` | D8 指标 |
| 问题定义 | `product/problem-statement.md` | 背景 |
| 实施计划 | `design/implementation-plan-v1.md` | 任务级计划 |
| 阶段契约 | `design/stage-specs/S*.md` | 机器可验证 DoD |
| 领域 / 架构 | `design/domain-*.md`、`architecture.md` | 设计与追溯 |
| 追溯矩阵 | `design/prd-domain-traceability.md` | PRD ↔ 领域 |
| 决策 | `decisions/*.md` | ADR |
| 发布 | `product/launch-plan.md`、`announce-v0.1.0.md` | 首发检查清单 |
| 贡献 / 安全 | `/CONTRIBUTING.md`、`/SECURITY.md` | 贡献与安全 |
| 代码与脚本 | `packages/*`、`scripts/*` | 可运行产物 |

## 维护者本地（gitignore · 勿 push）

| 类别 | 典型路径 | 说明 |
|------|----------|------|
| 工程交接 | `HANDOFF.md`、`HANDOFF-ARCHIVE/` | Session 交接 |
| 各类审计 | `**/*AUDIT*.md` | 计划/产品/实现审计 |
| 交付台账 | `docs/delivery/` | tickets 索引、dogfood 周记、日志 |
| 调研 | `docs/research/` | 行业 / 竞品景观 |
| 过程笔记 | `0-1-path.md`、`stage-plan.md`、`product-marketing.md` | 内部过程与定位草稿 |
| Agent 工具 | `.agents/` | 本地 Agent 配置 |
| 竞品镜像 | `refs/competitors/` | 本地参考 |

需要新增公开文档时，由维护者明确指示后再入库。

## 与 GitHub 的衔接

| 项 | 说明 |
|----|------|
| Issues | Ticket 追踪以 GitHub Issues #1–#16 为准（公开） |
| Milestone | M0–M5、V1（对齐 ROADMAP） |
| 模板 | `.github/ISSUE_TEMPLATE/`、PR 模板 |
| Release | launch 检查清单全绿后打 tag |

Issue/PR 请标明阶段；Release 对照 `launch-plan.md`。
