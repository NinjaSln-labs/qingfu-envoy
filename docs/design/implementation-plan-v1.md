# Qingfu Envoy V1 · Implementation Plan

> **For implementers:** 每实现任务遵循 **红→绿→重构**；未授权 **S{n}** 不跨阶段写代码。  
> **Goal:** 提议→人确认→Mock/支付宝 sandbox 执行→审计导出→退款；CLI + MCP + Web。  
> **Architecture:** `packages/core` 领域+应用；三壳 + `rails-alipay`。  
> **Tech Stack:** Node ≥20, TypeScript, vitest；支付宝 OpenAPI sandbox（S5）。  
> **权威：** PRD `docs/product/prd.md`；领域 `docs/design/domain-model.md`；阶段 `docs/design/stage-plan.md`。

## Global Constraints（ADR + PRD）

- **001** 禁止静默自付；无 `approved` 不得 `execute`  
- **002** dogfood 见 D8；完成后更新 HANDOFF  
- **003** 三端分期；首轨支付宝 sandbox  
- **004** freeze 只挡新提议；已 `approved` 仍可 execute；退款 `refunded|refund_failed`  
- 密钥仅环境变量；永不 commit  
- 用户明确要求才 git commit  

## 阶段依赖（必须遵守）

```text
S0 本计划定稿（仅文档）
  → S1 core + 应用用例 + 持久化 + 门禁测试
  → S2 CLI
  → (S3 MCP ∥ S4 Web)   # 可并行，均依赖 S2
  → S5 支付宝 sandbox
```

## 文件地图（目标态）

```text
package.json                 workspaces 含 cli/mcp/web/rails-alipay
packages/core/src/
  domain/                    proposal, envoy, types（可自现有文件迁）
  app/                       用例：propose/approve/…/export（编排+审计）
  persistence/               JsonStore → ~/.qingfu-envoy/
  ports/                     PaymentRail, AuditSink
  index.ts
packages/cli/
packages/mcp/
packages/web/
packages/rails-alipay/
~/.qingfu-envoy/             proposals.json, envoys.json, audit.jsonl（运行时，不入库）
```

`createMockRail` 保留在 `core`（架构：mock 可内嵌）；不单独 `rails-mock` 包除非 S1 后体积逼迁。

## PRD P0 → 阶段 → 任务（全覆盖）

| P0 | 阶段 | 任务 ID |
|----|------|---------|
| P0-1 创建提议+审计 | S1 | S1.0 |
| P0-2 允准/驳回+审计 | S1 | S1.0 |
| P0-3 仅批准执行 | S1 | S1.0, S1.3 |
| P0-4 审计事件 | S1 | S1.0 |
| P0-5 取消未决 | S1 | S1.0 |
| P0-6 急停/解冻 | S1 | S1.2 |
| P0-7 无静默路径 | S1 | S1.3 |
| P0-8 MockRail | S1 | S1.1 |
| P0-9 退款 | S1 | S1.1 |
| P0-10 导出 JSON | S1 | S1.4；S2 暴露命令 |
| P0-11 CLI | S2 | S2.1–S2.3 |
| P0-12 MCP | S3 | S3.1–S3.2 |
| P0-13 Web | S4 | S4.1 |
| P0-14 支付宝 sandbox | S5 | S5.1–S5.2 |

## TDD 纪律（S1 起每条任务）

1. 写失败测试（或 rg 门禁）  
2. 运行确认失败  
3. 最小实现使绿  
4. `npm test && npm run build`  
5. （可选）用户要求时 commit  

## D8 阶段门禁（摘要）

| 阶段 | 必达 |
|------|------|
| S1 | 无人确认 execute 测试红/绿；freeze 语义测试；退款状态机 |
| S2 | CLI 10 分钟 Mock 一笔；导出 JSON 可解析 |
| S3 | MCP 无 blind execute |
| S4 | localhost only |
| S5 | 无 env skip；有 env 可 sandbox 或文档 unsupported |

---

## S1 · core + 应用 + 持久化

### Task S1.0 — 生命周期用例与审计（P0-1…P0-5, P0-3 编排）

- [ ] **红** `lifecycle.audit.test.ts`：propose/approve/reject/cancel 各产生 AuditEvent  
- [ ] **绿** `app/proposal-service.ts` 编排领域函数 + `recordTransition`  
- [ ] **绿** `executeApproved` 经同一服务调用；失败/成功均审计  
- [ ] **红** 非法迁移测试（reject 后再 approve 等）  
- [ ] **绿** `persistence/json-store.ts` 读写 `~/.qingfu-envoy/`  
- **Verify:** `npm test`

### Task S1.1 — 退款状态与端口（P0-8 refund 分支, P0-9）

- [ ] **红** `refund.state.test.ts`  
- [ ] **绿** `types.ts` 增 `refunded`/`refund_failed`；`rail.refund`；`app/refund-service.ts`  
- [ ] **绿** `createMockRail` refund 成功/失败  
- **Verify:** `npm test`

### Task S1.2 — 急停语义（P0-6）

- [ ] **红** `envoy.freeze-semantics.test.ts`：frozen 不可 propose；已 approved 可 execute  
- [ ] **绿** `unfreeze`；应用层 `freezeEnvoy`/`unfreezeEnvoy`  
- **Verify:** `npm test`

### Task S1.3 — 禁未批执行 + 无静默符号（P0-7）

- [ ] **红** `execution.refuse-unapproved.test.ts`  
- [ ] **绿** rg/测试：无 `silent`/`autoPay`/`executeWithoutApproval`  
- **Verify:** `npm test && npm run build`

### Task S1.4 — 导出 helper（P0-10 领域侧）

- [ ] **红** `export-audit.test.ts`：JSON 含 actor/from/to  
- [ ] **绿** `app/export-audit.ts`  
- **Verify:** `npm test`

### Task S1.5 — PRD 错误态契约测试

- [ ] **红** `error-states.test.ts`：缺字段、未批准执行、冻结后 propose、重复 execute  
- **Verify:** `npm test`

**S1 门禁：** `docs/design/stage-specs/S1.md` DoD 全勾选。

---

## S2 · CLI（P0-11）

### Task S2.0 — 工作区

- [ ] 根 `package.json` workspaces 加入 `cli`  
- **Verify:** `npm install` 无报错

### Task S2.1 — 脚手架

- [ ] `packages/cli`、bin `qingfu`、依赖 `@qingfu/core`  
- **Verify:** `qingfu --help`

### Task S2.2 — 命令

- [ ] `propose` `list` `approve` `reject` `cancel` `execute` `refund` `export` `freeze` **`unfreeze`**  
- [ ] 调用 S1 应用服务；数据落 `~/.qingfu-envoy/`  
- **Verify:** `cli/happy-path.test.ts`

### Task S2.3 — Dogfood 文档

- [ ] `packages/cli/README.md` ≤10 分钟 Mock 步骤  
- **Verify:** 人工走通一笔

**S2 门禁：** `stage-specs/S2.md` DoD。

---

## S3 · MCP（P0-12）

### Task S3.1 — 工具

- [ ] `envoy_propose` `envoy_list` `envoy_get` `envoy_cancel` **`envoy_status`**（轮询状态）  
- [ ] 不暴露 blind `execute`；可选本地 `QINGFU_PRINCIPAL_TOKEN` 门禁  
- **Verify:** `mcp/propose.test.ts` `mcp/no-blind-execute.test.ts`

### Task S3.2 — E2E 文档

- [ ] MCP 提议 + CLI approve + MCP status 见 executed  
- **Verify:** 文档可重复

**S3 门禁：** `stage-specs/S3.md` DoD。

---

## S4 · Web（P0-13）

### Task S4.1 — 本地任务面

- [ ] IA：Envoy 列表 / 提议列表 / 详情 / 审计时间线  
- [ ] 动作：允准、驳回、取消、急停、**解冻**、导出、退款请求  
- [ ] `127.0.0.1` only  
- **Verify:** `web/list.spec.ts`；手工对照 PRD IA 勾选

**S4 门禁：** `stage-specs/S4.md` DoD。

---

## S5 · 支付宝 sandbox（P0-14）

### Task S5.1 — 适配器

- [ ] `packages/rails-alipay`；env：`ALIPAY_*` 或 `AIPAY_*`（文档列名）  
- [ ] 无 env：集成测试 `skip`  
- **Verify:** `rails-alipay/execute.sandbox.test.ts`

### Task S5.2 — refund 契约

- [ ] 成功 / 失败 / `rail_unsupported` 三分支可测或文档化  
- **Verify:** 测试或 ADR 脚注

**S5 门禁：** `stage-specs/S5.md` DoD。

---

## 风险与回滚

- 探索 `packages/core` 与计划冲突 → 以 `domain-model.md` 为准在 S1.0 重构  
- 支付宝邀测未开 → S5 unsupported 不挡 S2–S4  
- 持久化路径冲突 → 仅 `~/.qingfu-envoy/`，可配置 env `QINGFU_DATA_DIR`

## 完成后

- 更新 HANDOFF；D8 dogfood 计数；对照 `launch-plan.md` 检查清单（不自动发布）。
