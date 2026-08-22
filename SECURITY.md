# Security Policy · 青蚨使 / Qingfu Envoy

## 范围

本仓库处理 **付款提议、确认与审计** 的控制面逻辑。我们**不是**支付牌照机构；真轨执行依赖支付宝等第三方 SDK。

## 报告安全问题

**请勿**在公开 Issue 中披露可被利用的细节、PoC  exploit 或真实密钥。

请通过 GitHub **Private vulnerability reporting**（仓库 Security → Report a vulnerability），或联系维护者私下渠道。

报告请包含：

- 影响组件（core / CLI / MCP / Web / rail 适配器）  
- 复现步骤（可用 Mock 轨；**勿**附真实商户密钥）  
- 是否涉及「未确认即执行」或审计链篡改  

## 我们特别关注的类

| 类 | 说明 |
|----|------|
| 授权绕过 | 未经 `approved` 状态即调用 execute |
| 静默扣款 | 任何免主理人确认的路径（违反 ADR 001） |
| 密钥泄漏 | 私钥进仓库、日志、Issue、PR |
| 审计篡改 | 事件链可被静默删除或伪造 |
| MCP/CLI 盲执行 | Agent 面暴露无门禁的 execute |

## 安全开发

- 复制 [.env.example](.env.example) 为本地 `.env`；`.env` 已在 `.gitignore`  
- 支付宝/微信凭证仅本地或 CI secret，**永不 commit**  
- PR 涉及支付路径时对照 [ADR 001](docs/decisions/001-no-license-no-silent-pay.md)、[ADR 004](docs/decisions/004-refund-and-freeze-semantics.md)  

## 响应预期

维护者为个人/小团队节奏，会在合理时间内确认收到；严重问题（密钥泄漏、授权绕过）优先处理。

## 披露

修复后会在 Release note 或 Security advisory 中致谢（除非你要求匿名）。
