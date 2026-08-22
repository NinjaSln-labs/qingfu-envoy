# PRD ↔ 领域追溯矩阵

- Status: accepted
- Date: 2026-08-22
- PRD：`docs/product/prd.md`  
- 领域：`docs/design/domain-model.md`

图例：直接 = 一对一；精化 = 领域更细；偏离 = 有意差异（须说明）

| PRD ID | 产品陈述 | 领域元素 | 关系 | 说明 |
|--------|----------|----------|------|------|
| P0-1 | 创建提议 | PaymentProposal.propose | 直接 | |
| P0-2 | 允准/驳回 | approve/reject | 直接 | |
| P0-3 | 仅批准后执行 | 不变量1 + PaymentExecutionService | 直接 | |
| P0-4 | 审计事件 | AuditEvent + AuditSink | 直接 | |
| P0-5 | 取消未决 | cancel | 直接 | |
| P0-6 | 急停 | Envoy.freeze + assertCanPropose | 精化 | 004：不挡已批准执行 |
| P0-7 | 无静默路径 | 无该迁移边；测试 | 直接 | |
| P0-8 | MockRail | PaymentRail mock | 直接 | |
| P0-9 | 退款请求 | RefundService + refunded/refund_failed | 直接 | 004 |
| P0-10 | 导出审计 | AuditSink 查询 + 应用导出 | 精化 | 应用层序列化 JSON |
| P0-11 | CLI | 架构 CLI 壳 | 直接 | 无新领域概念 |
| P0-12 | MCP | 架构 MCP 壳 | 直接 | 门禁在应用层 |
| P0-13 | Web | 架构 Web 壳 | 直接 | |
| P0-14 | 支付宝 sandbox | rails-alipay | 直接 | Rail BC |
| Goal 无人确认=0 | D8 | 不变量1 + P0-7 测试 | 直接 | |
| Non-Goal 静默 | 001 | 模型禁止边 | 直接 | |
| Non-Goal 策略引擎 | P2 | 未建模 | 直接 | 有意不做 |
| 故事「清楚确认」 | 问题陈述 | 人审每笔；无自动边界引擎 | 偏离→对齐 | 已改为看清字段后人审，非策略引擎 |

**空洞检查**：PRD P0-1…P0-14 均有落点；无「有 PRD 无领域」Critical 项。
