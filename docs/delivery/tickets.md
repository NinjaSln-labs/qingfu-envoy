# Tickets 索引（tracer bullets）

对齐 `implementation-plan-v1.md`；AC 以 `stage-specs/S*.md` DoD 为准。

| ID | 标题 | 阶段 | 依赖 | 计划任务 |
|----|------|------|------|----------|
| T0.1 | 实施计划定稿+审计 | S0 | — | 全文 + 本审计通过 |
| T1.0 | 生命周期+持久化+审计 | S1 | T0.1 | S1.0 |
| T1.1 | refund + MockRail | S1 | T1.0 | S1.1 |
| T1.2 | freeze/unfreeze 语义 | S1 | T1.0 | S1.2 |
| T1.3 | 禁未批+无静默符号 | S1 | T1.0 | S1.3 |
| T1.4 | 导出 helper | S1 | T1.0 | S1.4 |
| T1.5 | 错误态契约测试 | S1 | T1.0 | S1.5 |
| T2.0 | workspaces | S2 | S1 | S2.0 |
| T2.1 | CLI scaffold | S2 | T2.0 | S2.1 |
| T2.2 | CLI 命令全路径 | S2 | T2.1 | S2.2 |
| T2.3 | CLI dogfood 文档 | S2 | T2.2 | S2.3 |
| T3.1 | MCP 工具+禁盲执行 | S3 | S2 | S3.1 |
| T3.2 | MCP E2E 文档 | S3 | T3.1 | S3.2 |
| T4.1 | Web 任务面 | S4 | S2 | S4.1 |
| T5.1 | 支付宝 execute | S5 | S2 | S5.1 |
| T5.2 | 支付宝 refund | S5 | T5.1 | S5.2 |
