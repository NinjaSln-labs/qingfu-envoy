# v0.1.0 发布公告 · 青蚨使 / Qingfu Envoy

> Release：https://github.com/NinjaSln-labs/qingfu-envoy/releases/tag/v0.1.0  
> 用途：ORB **Owned**（博客/README 链）· **Rented**（社媒）· **Borrowed**（社群投稿，按需删减）

---

## 短文（推荐 · 微博 / X / 即刻 / 朋友圈）

**青蚨使 v0.1.0 开源了**

给 Agent 用的付款**控制面**，不是钱包、不是支付公司。

流程很简单：**Agent 只能提议 → 你点允准 → 才走 Mock/支付宝轨执行**。完整审计、可急停、可退款请求。**默认禁止静默自付。**

CLI + MCP + 本地 Web 三端，自托管，`npm test` 全绿。

👉 https://github.com/NinjaSln-labs/qingfu-envoy/releases/tag/v0.1.0

个人开发者 / 玩 Agent 的欢迎 Star、Issue、PR。我们不做牌照生意，也不卖「免密代扣」。

---

## 论坛 / 社群帖（稍长 · V2EX / 掘金 / 开源群）

**标题建议：** 开源「青蚨使」v0.1.0：Agent 付款控制面，强制人确认、禁止静默自付

大家好，我们刚发了 **Qingfu Envoy（青蚨使）v0.1.0**——一个给个人开发者用的 **Agent 付款控制面**（Apache-2.0）。

**解决什么问题？**  
你敢让 Agent「自己付钱」吗？大厂钱包里 Agent 付往往是黑盒。青蚨使把流程钉死在：

**提议 → 你确认 → 持牌通道执行**（首版含 Mock dogfood + 支付宝 sandbox 适配器）。

**不是什么：** 不是支付机构、不是静默代扣、不是额度内免确认扣款（见 ADR 001）。

**这版有什么：**

- `@qingfu/core` 领域核（审计 JSON、急停/解冻、退款状态机）
- CLI 主理人壳 `qingfu`
- MCP Envoy 工具（**故意不暴露 blind execute**）
- 本地 Web 任务面（127.0.0.1）
- 契约测试 62+ 绿

**10 分钟试玩（Mock）：**

```bash
git clone https://github.com/NinjaSln-labs/qingfu-envoy.git
cd qingfu-envoy && npm install && npm run build
node packages/cli/dist/cli.js envoy register agent-1 --name demo
node packages/cli/dist/cli.js propose --envoy agent-1 --id p1 --amount 1.00 --purpose test --payee shop
node packages/cli/dist/cli.js approve p1 && node packages/cli/dist/cli.js execute p1
```

Release 说明与文档索引：  
https://github.com/NinjaSln-labs/qingfu-envoy/releases/tag/v0.1.0

欢迎 Star、Issue 讨论领域语言/产品边界。Private beta 邀请名单还在想，先开源迭代。

---

## English（X / HN / Reddit 短帖）

**Qingfu Envoy v0.1.0** — open-source **agent payment control plane** (not a PSP).

Agents **propose** → you **approve** → licensed rails **execute** (Mock + Alipay adapter). Full audit trail, freeze/unfreeze, refund requests. **No silent auto-pay.**

CLI + MCP + local Web. Self-hosted. Apache-2.0.

https://github.com/NinjaSln-labs/qingfu-envoy/releases/tag/v0.1.0

---

## 发布检查（发前扫一眼）

- [ ] 链接可打开（Release + README）
- [ ] 未包含任何密钥 / 内网地址
- [ ] 语气：控制面、人确认、非牌照（与 PRD/ADR 一致）
- [ ] 可选：首周后把 Star / Issue 数记到 launch-plan 或本文件底部

### 首周记录（发布后填写）

| 日期 | 渠道 | Star Δ | Issue/讨论 | 备注 |
|------|------|--------|------------|------|
| 2026-08-25 | GitHub Discussions #17（Announcements） | 0→? | [discussion #17](https://github.com/NinjaSln-labs/qingfu-envoy/discussions/17) | Owned；社媒暂无 |
