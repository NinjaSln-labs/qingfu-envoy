# PRD · 青蚨使 / Qingfu Envoy（V1 定稿）

- Status: **accepted**
- Date: 2026-08-22
- 约束：ADR **001–004**
- 问题：`docs/product/problem-statement.md`
- 指标：`docs/product/success-metrics.md`（D8）
- 实施与门禁：`docs/design/implementation-plan-v1.md`、`docs/design/stage-specs/`

## Problem Statement

个人开发者要用 Agent 完成需付款任务，又不敢授「静默扣款」权。V1 提供开源、可自托管控制面：**提议 → 人确认 → 持牌通道执行**，具备审计导出、急停、取消未决与退款请求入口。

## Principles

1. **人确认优先**：无 `approved` 不得 `execute`（001）。  
2. **不碰牌照**：只编排，扣款/退款走持牌轨（001）。  
3. **可看见、可停下、可追索**：任务面 + 急停 + 审计导出 + 退款请求（004）。  
4. **一核多壳**：领域核唯一；CLI / MCP / Web 为适配器（003）。  
5. **慢路径**：无 stage-spec 不开产品化实现（0→1 路径）。

## Goals

1. 任意扣款前必有人确认（D8：无人确认扣款=0）。  
2. 主理人在任务面看到待确认/已处理提议，可取消未决、冻结 Envoy、发起退款请求。  
3. 每笔状态迁移可审计并可导出 JSON。  
4. MockRail 与支付宝 sandbox 适配器均可跑通执行（及退款端口契约）。

## Non-Goals（V1）

| 不做 | 原因 |
|------|------|
| 静默自付 / 额度内自动扣 | ADR 001 |
| 自建清算、收单、备付金 | 无牌照 |
| 赔付基金 | 重资产 |
| 微信真轨 | ADR 003 → V1.1+ |
| 策略边界引擎（品类/商户/时窗自动裁决） | P2；V1 靠人审每笔 |
| 多级企业审批 | 客群未定 B 端 |
| x402 默认轨 | P2 |
| 公网多租户 SaaS 收单 | 超出个人开源控制面 |

## Personas

| 角色 | 说明 |
|------|------|
| 主理人 Principal | 出资并确认/拒绝/急停/退款请求（V1=单机单主理人） |
| 青蚨使 Envoy | Agent：提议、等待、读取结果；不得自行扣款 |

## 信息架构（任务面）

```text
[Envoy 列表] → [该使下的提议列表：proposed|approved|…]
             → [提议详情：金额/用途/收款摘要/状态/审计时间线]
             → 动作：允准|驳回|取消|执行(系统)|退款请求|导出审计
[急停] 冻结/解冻 Envoy
```

CLI / Web 呈现同一 IA；MCP 暴露等价工具（propose、list、get、cancel；**确认类工具默认仅本地主理人会话可用**，禁止对不可信远端开放免确认执行）。

## 主路径状态机

```text
proposed → approved → executed → refunded
        ↘ rejected          ↘ refund_failed（保留 executed 语义证据）
        ↘ cancelled
approved → failed（轨执行失败）
```

非法迁移 → 领域错误。无 silent/auto 边。

## 错误态（产品可见）

| 场景 | 用户可见 |
|------|----------|
| 缺必填提议字段 | 拒绝创建 + 字段错误 |
| 未批准执行 | 明确错误：须先允准 |
| 冻结后新提议 | 拒绝：Envoy 已急停 |
| 轨执行失败 | 状态 `failed` + 原因 |
| 退款轨不支持 | `refund_failed` + `rail_unsupported` |
| 重复执行 | 拒绝：非 approved |

## User Stories

**主理人**

- 看到提议（金额、用途、收款摘要）并允准/驳回。  
- 取消未决提议；冻结/解冻 Envoy。  
- 对已执行提议发起退款请求并看到终态。  
- 导出某笔审计链 JSON。

**Envoy**

- 提交结构化提议并轮询/订阅状态。  
- 在批准后得知执行或失败结果；不得在未批准时调轨。

## Requirements

### Must-Have（P0）

| ID | 行为 | Acceptance Criteria |
|----|------|---------------------|
| P0-1 | 创建 PaymentProposal | 必填校验；status=`proposed`；审计 |
| P0-2 | approve / reject | 仅 proposed；非法迁移抛错；审计 |
| P0-3 | execute 仅 approved | 否则失败；成功 `executed`+railRef；失败 `failed`；审计 |
| P0-4 | 每次迁移 AuditEvent | who/when/from/to/detail；可按 proposal 查询 |
| P0-5 | cancel 未决 | proposed→cancelled |
| P0-6 | freeze Envoy | 不可新提议；已 approved 仍可 execute；proposed 可 cancel（004） |
| P0-7 | 无静默路径 | API/代码无 auto-pay；测试锁定 |
| P0-8 | MockRail | execute/refund 可注入成功失败 |
| P0-9 | 退款请求 | executed→refunded\|refund_failed；审计（004） |
| P0-10 | 审计导出 JSON | 单笔完整事件链 |
| P0-11 | CLI 壳 | 列出/确认/拒绝/取消/急停/导出/触发执行与退款 |
| P0-12 | MCP 壳 | propose/list/get/cancel/status；确认经主理人受控通道 |
| P0-13 | 本地 Web 壳 | 任务面 IA + 同上主理人动作 |
| P0-14 | 支付宝 sandbox 轨 | 配置经环境变量；execute 联调；refund 按契约（支持或 rail_unsupported） |

### Nice-to-Have（P1）

- 通知钩子（新提议/终态）  
- CSV 导出  
- 多 Envoy 标签筛选  

### Future（P2）

- 静默自付（新 ADR）  
- 策略边界引擎  
- 微信轨、AP2/x402  

## 非功能

| 项 | 要求 |
|----|------|
| 安全 | 私钥/商户密钥仅环境变量或 OS 钥匙串；不入库明文；不进 git |
| 合规 | 不宣称持牌；README 标明控制面定位 |
| 运行 | Node ≥20；本地单用户 |
| 可测 | 领域与轨端口契约测试；无人确认执行必红 |

## Agent / Spec 六核心（实现期遵守）

| 域 | 约定 |
|----|------|
| 命令 | `npm test` / `npm run build`；阶段 DoD 以 stage-spec 为准 |
| 测试 | 先红后绿；P0-7/P0-3 永不可删 |
| 结构 | `packages/core` 领域；`packages/cli|mcp|web|rails-alipay` 适配器 |
| 风格 | 领域语言中英对照见设计文档；禁止静默命名 |
| Git | 用户明确要求才 commit；secrets 永不提交 |
| 边界 | Always：人确认后才 execute。Ask first：真网生产密钥。Never：静默扣款、提交密钥、无 spec 铺三端 |

## Open Questions

| 问题 | 状态 |
|------|------|
| 三端与首轨 | **已裁定 003** |
| 退款与急停 | **已裁定 004** |
| dogfood | **已裁定 002** |
| 支付宝具体产品码（App 付 vs 其它） | 工程在 S_rail 选型；不挡 PRD |

## Timeline

服从 `docs/design/stage-specs/` 与实施计划：**先设计与 stage-spec，再实现**。无对外硬截止日期。

## 追溯

- 领域：`docs/design/domain-model.md`  
- 矩阵：`docs/design/prd-domain-traceability.md`  
- 旧草稿 `mvp-v0-prd.md` → **废止，以本文为准**
