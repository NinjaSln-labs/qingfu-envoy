# 003 — V1 三端分期与首轨支付宝

- Status: accepted
- Date: 2026-08-22（审计修复：闭合 Open Questions）
- 相关：`docs/product/prd.md`；ADR 001

## Context

会话已意向「CLI / 本地 Web / MCP 都要」且「真轨审批个人侧支付宝更易」。PRD 草稿仍列为 Open Question，与 0→1 路径「意向」不一致。

## Decision

- **V1 范围包含三端**，分期交付（非砍掉）：  
  - **S_cli**：CLI（主理人确认与急停主路径）  
  - **S_mcp**：MCP（Envoy 提交提议、查询状态）  
  - **S_web**：本地 Web（任务面与审计浏览）  
- **第一条真轨：支付宝 sandbox 适配器**；微信为 V1.1+（建议具备个体户资质后再开）。  
- MockRail 始终保留，用于无密钥演示与契约测试。  
- 实现须在 stage-spec 开工后进行；本 ADR 不授权抢跑。

## Consequences

- 正面：定义闭合；个人开发者审批路径清晰。  
- 负面：三端工作量大，必须垂直切片、禁止横向铺开。
