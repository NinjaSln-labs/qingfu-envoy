# Tickets 索引（tracer bullets）

对齐 `implementation-plan-v1.md`；AC 以 `stage-specs/S*.md` DoD 为准。

**GitHub Issues：** 每 Ticket 对应一 Issue，挂 ROADMAP Milestone。见下表 `#` 列。

| ID | 标题 | 阶段 | 依赖 | 计划任务 | Issue |
|----|------|------|------|----------|-------|
| T0.1 | 实施计划定稿+审计 | S0 | — | 全文 + 本审计通过 | [#1](https://github.com/NinjaSln-labs/qingfu-envoy/issues/1) ✅ |
| T1.0 | 生命周期+持久化+审计 | S1 | T0.1 | S1.0 | [#2](https://github.com/NinjaSln-labs/qingfu-envoy/issues/2) |
| T1.1 | refund + MockRail | S1 | T1.0 | S1.1 | [#3](https://github.com/NinjaSln-labs/qingfu-envoy/issues/3) |
| T1.2 | freeze/unfreeze 语义 | S1 | T1.0 | S1.2 | [#4](https://github.com/NinjaSln-labs/qingfu-envoy/issues/4) |
| T1.3 | 禁未批+无静默符号 | S1 | T1.0 | S1.3 | [#5](https://github.com/NinjaSln-labs/qingfu-envoy/issues/5) |
| T1.4 | 导出 helper | S1 | T1.0 | S1.4 | [#6](https://github.com/NinjaSln-labs/qingfu-envoy/issues/6) |
| T1.5 | 错误态契约测试 | S1 | T1.0 | S1.5 | [#7](https://github.com/NinjaSln-labs/qingfu-envoy/issues/7) |
| T2.0 | workspaces | S2 | S1 | S2.0 | [#8](https://github.com/NinjaSln-labs/qingfu-envoy/issues/8) |
| T2.1 | CLI scaffold | S2 | T2.0 | S2.1 | [#9](https://github.com/NinjaSln-labs/qingfu-envoy/issues/9) |
| T2.2 | CLI 命令全路径 | S2 | T2.1 | S2.2 | [#10](https://github.com/NinjaSln-labs/qingfu-envoy/issues/10) |
| T2.3 | CLI dogfood 文档 | S2 | T2.2 | S2.3 | [#11](https://github.com/NinjaSln-labs/qingfu-envoy/issues/11) |
| T3.1 | MCP 工具+禁盲执行 | S3 | S2 | S3.1 | [#12](https://github.com/NinjaSln-labs/qingfu-envoy/issues/12) |
| T3.2 | MCP E2E 文档 | S3 | T3.1 | S3.2 | [#13](https://github.com/NinjaSln-labs/qingfu-envoy/issues/13) |
| T4.1 | Web 任务面 | S4 | S2 | S4.1 | [#14](https://github.com/NinjaSln-labs/qingfu-envoy/issues/14) |
| T5.1 | 支付宝 execute | S5 | S2 | S5.1 | [#15](https://github.com/NinjaSln-labs/qingfu-envoy/issues/15) |
| T5.2 | 支付宝 refund | S5 | T5.1 | S5.2 | [#16](https://github.com/NinjaSln-labs/qingfu-envoy/issues/16) |

## Milestone 对照

| Milestone | Tickets |
|-----------|---------|
| M0.5 计划披露 | T0.1 |
| M1 可信内核 | T1.0–T1.5 |
| M2 主理人 CLI | T2.0–T2.3 |
| M3 Agent 接入 | T3.1–T3.2 |
| M4 任务面 | T4.1 |
| M5 真轨骨架 | T5.1–T5.2 |

批量创建脚本（勿重复跑）：`scripts/create-github-issues.sh`
