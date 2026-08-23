# 002 — 发现阶段采用 dogfood 优先

- Status: accepted
- Date: 2026-08-22（审计修复：闭合用户研究缺口）
- 相关：`docs/product/problem-statement.md`；`docs/product/success-metrics.md`（D8）

## Context

问题陈述主用户为 Assumption，尚无访谈样本。完整用户研究为可选，但 0→1 路径要求退出①时有证据或明确裁定。个人开发者产品适合先自用验证「提议→确认→执行」闭环。

## Decision

- **① 发现退出采用 dogfood 优先**：作者本人（及自愿试用的同伴）为第一批主理人；不阻塞②定稿。
- 问题陈述中的 Assumption **保留标签**，但升格为「dogfood 假设」：以自用周记/任务日志为证据源，满 4 周或 20 笔真实确认后回写问题陈述。
- 对外发布前若客群扩展，再补访谈纪要（不少于 3 人）或新 ADR。

## Consequences

- 正面：不因「缺访谈」卡住定义；证据路径清晰。
- 负面：早期偏差风险；须在 D8 中跟踪 dogfood 笔数与主观信任分。
