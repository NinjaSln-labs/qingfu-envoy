# 领域模型 · 青蚨使

- Status: accepted
- Date: 2026-08-22
- 产品门禁：`docs/product/prd.md`；ADR 001–004

## 限界上下文

| BC | 职责 | V1 |
|----|------|-----|
| **Mandate Payment Control** | 提议、允准、执行编排、退款请求、急停、审计 | 做 |
| **Rail Adapter** | 支付宝/Mock 等 execute/refund | 做（端口+Mock+支付宝 sandbox） |
| Identity/KYC Provider | 实名与商户入驻 | **不做**（依赖轨侧账号） |
| Clearing/Ledger | 清算备付金 | **不做** |

跨 BC：仅通过 `PaymentRail` / `AuditSink` 端口；控制面不持久化支付密钥。

## 聚合与不变量

### PaymentProposal（聚合根）

- 属性：id, envoyId, money, purpose, payeeSummary, status, railRef?, failureReason?, createdAt  
- **不变量**  
  1. 非 `approved` 不得 `execute`  
  2. 非 `executed` 不得 `requestRefund`  
  3. `rejected` / `cancelled` / `refunded` 为终态（`refund_failed` 保留已执行事实，允许主理人再次发起退款请求——V1 允许重试）  
  4. 无静默边  

### Envoy

- 属性：id, displayName, frozen  
- **不变量**：`frozen` 时 `assertCanPropose` 失败；**不**阻止已 `approved` 的 `execute`（004）

### AuditEvent（追加只写）

- proposalId, at, actor, action, from, to, detail  
- 不变量：只增不改不删（V1 存储可为文件/SQLite；语义只追加）

## 领域服务

- `PaymentExecutionService.executeApproved`：断言 approved → rail.execute → markExecuted|Failed → 审计  
- `RefundService.requestRefund`：断言 executed → rail.refund → refunded|refund_failed → 审计  

## 领域事件（逻辑）

`ProposalProposed` / `ProposalApproved` / `ProposalRejected` / `ProposalCancelled` /  
`PaymentExecuted` / `PaymentFailed` / `RefundSucceeded` / `RefundFailed` / `EnvoyFrozen` / `EnvoyUnfrozen`

V1 可不做消息总线；审计流即事件投影。

## 非目标（模型层）

- Mandate 自动放行策略引擎  
- 多主理人审批链  
- 链上结算账本  

## 与探索代码

`packages/core` 为探索骨架：stage-spec 开工后须对齐本模型（补 refund 状态与端口），或以本模型重写并废弃偏离部分。
