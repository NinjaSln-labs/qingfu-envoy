# 领域语言 · 青蚨使

限界上下文：**授节付款（Mandate Payment Control）**——管提议、允准、执行编排、退款请求与审计；**不管**清算与备付金。

支付通道属 **轨适配器（Rail）** 上下文，经端口接入。

权威细节：`docs/design/domain-model.md`。急停/退款口径：**ADR 004**。

## 统一语言

| 中文 | English | 含义 |
|------|---------|------|
| 主理人 | Principal | 出资并做最终确认的人 |
| 青蚨使 / 使 | Envoy | 代为提议付款的 Agent |
| 付款提议 | PaymentProposal | 待确认/处理中的一笔付款 |
| 金额 | Money | `parseMoney` 校验；CNY 两位小数；整数分内部表示，禁止浮点 |
| 允准 / 驳回 | approve / reject | 主理人对 `proposed` 的决定 |
| 行金 / 执行 | execute | 仅 `approved` 后经轨付款 |
| 退款请求 | requestRefund | 对 `executed` 经轨发起退款 |
| 急停 | freeze | 冻结 Envoy，**禁止新提议**（已批准未执行仍可执行） |
| 审计事件 | AuditEvent | 状态迁移记录 |
| 审计作用域 | AuditScope | `proposal` 付款链 / `envoy` 急停（不混入 proposal 导出） |
| 支付轨 | PaymentRail | 持牌通道端口 |

**禁止用语（V1）**：静默自付、自动扣款、额度内免确认——ADR 001。

## 状态（节符）

`proposed` → `approved` → `executed` → `refunded`  
          ↳ `failed` / ↳ `refund_failed`  
`proposed` → `rejected` | `cancelled`（终态）

## 出站端口

```text
PaymentRail.execute(intent) → { ok, railRef?, error? }
PaymentRail.refund(intent)  → { ok, railRef?, error? } | unsupported
AuditSink.append(event)
```
