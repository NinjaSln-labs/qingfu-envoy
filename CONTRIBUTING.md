# Contributing · 青蚨使 / Qingfu Envoy

感谢关注本项目。我们是 **Agent 付款控制面**（非持牌支付机构）；所有贡献须对齐公开 ADR 与 stage-spec。

## 开始前

1. 读 [ROADMAP.md](ROADMAP.md) — 当前进度与 V1 做/不做  
2. 读 [docs/product/prd.md](docs/product/prd.md) — 产品范围权威  
3. 查 [docs/delivery/tickets.md](docs/delivery/tickets.md) — 是否已有对应 Ticket  
4. 边界变更须先 [ADR](docs/decisions/000-decision-log.md)，**禁止**口头扩大范围  

### 硬约束（不可 PR 绕过）

- **禁止静默自付** / 免确认扣款路径（[ADR 001](docs/decisions/001-no-license-no-silent-pay.md)）  
- 密钥、商户私钥、真实 `.env` **不得**进入仓库或 Issue/PR  
- 未通过 stage-spec DoD 的阶段**不得**在 README/ROADMAP 中宣称完成  

## 如何贡献

### 文档

- 修正笔误、链接、翻译：直接 PR，标题前缀 `[docs]`  
- 产品范围变更：先开 Issue 讨论 + 新 ADR，再改 PRD  

### 代码

当前维护节奏：**S1 尚未对社区批量开工**；大改动请先开 Issue 标明阶段（如 `S1`）。

1. Fork → 分支（例：`s1/refund-state-machine`）  
2. 实现须对应 [implementation-plan-v1](docs/design/implementation-plan-v1.md) 任务或 Ticket ID  
3. 测试：`npm install && npm test` 须绿  
4. PR 描述填写模板（阶段、Ticket、DoD 勾选）  

### Issue

使用仓库模板：

| 模板 | 用途 |
|------|------|
| Bug | 可复现缺陷（勿贴密钥） |
| Feature | 能力请求（可能需 ADR） |
| Scope / ADR | 范围与裁定讨论 |

## PR 检查清单

- [ ] 对应 ROADMAP 里程碑 / Ticket（如 T1.1）  
- [ ] 未引入静默 execute 或绕过 approve 的路径  
- [ ] `npm test` 通过  
- [ ] 文档链接仍有效（若改行为/API）  
- [ ] 无 `.env`、私钥、个人路径  

## 阶段纪律

```
S0 计划（文档）✅ → S1 core → S2 CLI → (S3 MCP ∥ S4 Web) → S5 支付宝 sandbox → V1 tag
```

详见 [stage-plan](docs/design/stage-plan.md) 与各 [stage-spec](docs/design/stage-specs/)。

## 行为准则

尊重、就事论事。支付与资金安全相关讨论保持审慎；不确定时开 Issue 而非猜测实现。

## English

Contributions must align with public ADRs and stage-spec DoD. **No silent auto-pay.** No secrets in PRs. See [ROADMAP](ROADMAP.md) for current stage; code work is gated from **S1** onward.
