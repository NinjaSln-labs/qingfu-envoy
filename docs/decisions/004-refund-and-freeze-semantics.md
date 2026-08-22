# 004 — V1 含退款请求入口；急停只挡新提议

- Status: accepted
- Date: 2026-08-22（审计修复：对齐用户三点与领域矛盾）
- 相关：`docs/product/prd.md`；`docs/design/domain-language.md`；用户原述「可关停或退款」

## Context

用户信任内核含「可退款」；调研列为 P0；PRD 草稿未写。领域语言对「冻结后能否 execute 已允准提议」前后矛盾。

## Decision

- **急停（freeze）**：冻结后 **禁止新建提议**；**已 `approved` 的提议仍可 `execute`**（主理人已允准的意图不因事后冻结作废）。未决 `proposed` 仍可 `cancel`。若需「冻结即作废已允准未执行」，须另 ADR。  
- **退款**：V1 必须提供主理人对 `executed` 提议的 **退款请求** 用例：经 `PaymentRail.refund`；成功→`refunded`，失败→`refund_failed`（保留原 executed 证据 + 失败原因）；全程审计。MockRail 必须可模拟退款成功/失败。真轨能力不足时：记录请求并将状态置 `refund_failed`（原因=`rail_unsupported`），不得静默吞掉。  
- **导出**：单笔/筛选审计链导出（JSON）为 V1 P0，与「详细审计」对齐。

## Consequences

- 正面：与用户三点对齐；急停单口径。  
- 负面：退款强依赖轨能力；须在适配器契约中显式 `refund` 端口。
