# 青蚨使能力景观调研 · 2026-08-22

> **范围声明（审计修复）**  
> 本文是**远期能力景观与竞品快照**，**不是 V1 产品范围权威**。  
> V1 / 前期范围以 **ADR 001–004** 与 **`docs/product/prd.md`** 为准。  
> 文中将「边界内自动付款」等列为能力 P0，指行业完整图景；**青蚨使 V1 明确不做静默自付**（001）。  
> 退款、急停、三端、首轨等产品裁定见 ADR 004 / 003，勿以本文覆盖 PRD。

**决策支持（历史）**：能力边界讨论。  
**用户曾强调的三点**：(1) 权限分级（提议 / 发起 / 付款与人审）(2) 详细审计 (3) 随时可见、可关停、可退款。  
**标签**：`Fact` = 可追溯公开源；`Inference` = 由事实推导；`Assumption` = 待验证假设。

---

# Competitive Research Snapshot

## 1. Scope

| 项 | 内容 |
|----|------|
| **Company/product** | 青蚨使 / Qingfu Envoy |
| **Category** | Agentic Payment（AI 自主付款基建 / 信任与授权层） |
| **Decision supported** | 产品能力边界与优先级（非市场份额报告） |
| **Competitors analyzed** | 支付宝 AI 付、京东 A2P2、Google AP2（+UCP）、OpenAI/Stripe ACP、x402、卡组织（Visa TAP / MC Agent Pay）与银联 APOP（后两者作轨层对照） |

## 2. Competitor Snapshots

### Competitor: 支付宝 AI 付 / AI 钱包 / ACT

- **Positioning:**「可控受托支付」——委托执行权而非让渡决策权；全栈 AI 付 / 收 / Token Pay / AI 钱包。 — **Fact** ([aipay.alipay.com](https://aipay.alipay.com/), [北京商报 2026-05](https://www.bbtnews.com.cn/2026/0527/594487.shtml))
- **Relevant capability:** 三类授权（逐笔确认 / 自定义规则 / 额度）；意图与授权匹配；交易留痕；Agent 身份；赔付与支付后管理。 — **Fact**（官网能力列表 + 报道）
- **Likely strength:** 规模（宣称 3 亿+ 笔、1 亿+ 用户）与消费心智；「你敢付我敢赔」。 — **Fact**（官网数字为自报）/ 证据质量：自报为主
- **Likely weakness:** 协议细节不如 Google 开源可审计；生态绑定支付宝账户。 — **Inference**
- **Key source URL:** https://aipay.alipay.com/

### Competitor: 京东 A2P2

- **Positioning:** 国内首个系统性「智能体自主支付协议」；可验证、可追责、可监管。 — **Fact** ([agentpay.jd.com](https://agentpay.jd.com/protocol.html), [36氪](https://www.36kr.com/p/3852261679708801))
- **Relevant capability:** L0–L5 自主等级；任务委托凭证；ARI（用户/Agent/运行环境三绑）；资金载体隔离；存证链。 — **Fact**（白皮书摘要 + 报道）
- **Likely strength:** 分级模型与你的「提议→发起→付款」高度同构；身份+存证设计清晰。 — **Inference**
- **Likely weakness:** 相对支付宝，公开规模与开发者生态证据更少。 — **Inference**
- **Key source URL:** https://agentpay.jd.com/protocol.html

### Competitor: Google AP2（+ UCP）

- **Positioning:** 开放、支付方式无关的 Agent 支付协议；可验证意图，非推断行为。 — **Fact**（本地 `refs/competitors/AP2/docs/index.md`）
- **Relevant capability:** Checkout/Payment Mandate（Open/Closed）；VDC 密码学审计链；Human-present / not-present；可接 x402。 — **Fact**（同仓库文档）
- **Likely strength:** 开源可拆；行业联盟背书；与商户层 UCP 分工清晰。 — **Fact**（repo + awesome 列表）
- **Likely weakness:** 中国零售/钱包落地路径不如支付宝/京东直接。 — **Inference**
- **Key source URL:** https://github.com/google-agentic-commerce/AP2 · 本地 `refs/competitors/AP2`

### Competitor: OpenAI + Stripe ACP

- **Positioning:** Agent ↔ 商家结账交互开源标准；Stripe Shared Payment Token 等轨。 — **Fact** ([agenticcommerce.dev](https://www.agenticcommerce.dev/), GitHub ACP)
- **Relevant capability:** 结账/购物车/订单/认证规格；商家按 Agent/交易接受或拒绝。 — **Fact**（规格 repo）
- **Likely strength:** ChatGPT 分发面；规格完整可实现。 — **Fact**（维护方声明）
- **Likely weakness:** 更偏「商户结账协议」而非完整「用户侧授权钱包 UX」。 — **Inference**
- **Key source URL:** https://github.com/agentic-commerce-protocol/agentic-commerce-protocol · 本地 `refs/competitors/ACP`

### Competitor: x402（轨层）

- **Positioning:** HTTP 402 互联网原生微支付；Agent/API 按次付。 — **Fact** ([x402.org](https://x402.org/), `refs/competitors/x402`)
- **Relevant capability:** 机器自动付 API/资源；非托管式链上结算为主。 — **Fact**（协议 README）
- **Likely strength:** 高频微额 A2M；与 AP2 human-not-present 样品衔接。 — **Fact**（AP2 samples）
- **Likely weakness:** 与国内法币钱包/消保模型不同；不单独解决「人审分级 UX」。 — **Inference**
- **Key source URL:** https://github.com/x402-foundation/x402

### 轨/身份层（简表，非主对标产品）

| 玩家 | 要点 | 标签 |
|------|------|------|
| Visa TAP | Agent HTTP 签名身份（RFC 9421）；本身不搬钱 | Fact — [Visa developer](https://developer.visa.com/capabilities/trusted-agent-protocol/docs) |
| Mastercard Agent Pay | Agentic Token + mandate | Fact — 行业报道聚合 |
| 银联 APOP | Agent 身份生命周期、意图、用户身份、支付授权四能力框架 | Fact — [Future of Banking 综述](https://futureofbanking.ai/article/unionpay-apop-agentic-payments) |

## 3. Quick Comparison

| Dimension | 青蚨使（目标） | 支付宝 AI 付 | 京东 A2P2 | AP2 | ACP | x402 |
|---|---|---|---|---|---|---|
| Target customer | 待定（Assumption：要「敢闭眼又睁眼」的个人/团队） | C 端 + AI 应用开发者 | 电商/任务型 Agent | 全球开发者/支付生态 | AI 平台 + 商家 | API/资源提供方 |
| Core use case | Agent 代付且人可控 | 授权内代付 + 收/订/计量 | 协议化自主付 | 可验证 Mandate 付 | Agent 内结账 | HTTP 微付 |
| Main strength | （产品未建）可押「可见+可杀+可退」文气品牌 | 规模与赔付心智 | L0–L5 + ARI + 存证 | 开源 Mandate 链 | 规格+分发 | 微额自动化 |
| Main weakness | 无轨/无牌照（Assumption） | 封闭细节 | 生态规模证据弱 | 国内钱包弱 | 偏商户协议 | 法币/消保弱 |
| Evidence quality | n/a | 中（自报量大） | 中（白皮书+报道） | 高（开源） | 高（开源） | 高（开源） |

## 4. So What?

- **产品策略 1：** 把你的三点做成一等公民——**分级自治 + 全链路审计 + 实时可见/急停/退款**——与京东 L 级、支付宝三类授权、AP2 Mandate 同构，可对外讲清。 — **Inference** · 信心：高
- **产品策略 2：** 身份（谁在付）与授权（允许多少）必须拆开；对标 ARI / TAP / Agent 凭证。 — **Inference** · 信心：高 · 源：A2P2 / Visa
- **产品策略 3：** 协议层可参考开源（AP2/ACP），产品层赢在「青蚨使」控制台体验与责任叙事，而非再发明一套结算轨。 — **Inference** · 信心：中
- **竞争风险 1：** 支付宝/京东用账户与赔付吃信任；无牌照玩家难拼「敢付敢赔」。 — **Inference** · 信心：高
- **竞争风险 2：** 国际协议碎片（AP2/ACP/UCP/x402/TAP）若全接会过载。 — **Fact**（生态存在多协议）+ **Assumption**（青蚨使初期应选 1 条对齐）
- **机会 1：** 「提议→人审→付」与「额度内静默付」之间的**可切换体验**仍是用户痛点叙事空间。 — **Assumption**
- **机会 2：** 审计日志对**普通人可读**（意图原文、为何被放行/拦截）竞品营销多、体验证据少。 — **Inference**
- **待验证假设 1：** 目标用户是个人助手、企业采购 Agent，还是开发者 SDK？
- **待验证假设 2：** 是否自建资金载体，还是挂靠已有支付机构？
- **待验证假设 3：** 退款是协议能力还是依赖下游商户/发卡行？

---

# 能力全景（面向青蚨使）

你的三点是**信任内核**；下面按域展开「还应具备什么」。优先级：P0 = 与三点同级或直接支撑；P1 = 行业标配；P2 = 差异化/后期。

## A. 授权与自治（对应你的 #1）— P0

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| 自治等级 | 至少：仅提议 / 提议+发起待审 / 边界内自动付款；可对标 L0–L4 | 京东 L0–L5；支付宝三类授权；AP2 Open/Closed Mandate |
| 策略边界 | 金额、品类、商户、时间窗、频次、单任务/跨任务 | 支付宝规则+额度；A2P2 任务委托凭证 |
| 意图固化 | 自然语言 → 可校验委托对象（金额/标的/收款方） | A2P2 任务委托凭证；AP2 Intent/Cart |
| 升级确认 | 越界或高风险强制人机确认（MFA） | 支付宝核身；Visa/发卡侧 |

## B. 审计与可解释（对应你的 #2）— P0

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| 事件链 | 提议、裁决、授权匹配、下单、扣款、结果、退款节点全记 | 支付宝 TRACE；A2P2 存证链；AP2 VDC 链 |
| 不可抵赖 | 关键凭证签名或哈希锚定（强度可选） | AP2 VDC；A2P2 存证 |
| 人话解释 | 「因何放行/拦截」对用户可读 | 竞品多宣称、产品差异空间大 |
| 导出/取证 | 争议时一键导出证据包 | 责任追溯共性需求 |

## C. 可见、急停、退款（对应你的 #3）— P0

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| 实时任务面 | 进行中的提议/付款流可看见（非仅事后账单） | 支付宝 AI 钱包「支付前/中管理」 |
| 全局急停 | 一键冻结该 Agent / 全部 Agent 支付权 | 授权管理共性；产品名可叫「收回节符」 |
| 单笔撤销 | 未决提议取消；进行中拦截 | Human-in-the-loop 必备 |
| 退款入口 | 已付发起退款/争议；状态可追踪 | 支付宝 DISPUTE；依赖下游轨 |
| 通知通道 | 提议/扣款/异常 push，避免「闭眼」感 | UX 标配 |

## D. 身份与信任 — P0/P1

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| Agent 身份 | 哪个 Agent、哪个版本、谁运营 | ARI；Visa TAP；支付宝 Agent 凭证 |
| 用户绑定 | 钱最终由谁承担（KYC 侧） | ARI「本人承担」 |
| 运行环境 | 设备/会话可信（防劫持） | A2P2 ARI 环境维 |
| 商户/收款方校验 | 防钓鱼收款 | 传统风控 + Agent 场景 |

## E. 资金与凭证 — P1

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| 资金隔离 | Agent 专用额度/子账户，不直触主户 | A2P2 资金载体 |
| 作用域凭证 | 一次性/限时/限商户支付令牌 | Stripe SPT；MC Agentic Token |
| 多轨适配 | 卡、钱包、（可选）稳定币微付 | AP2 多轨；x402 |

## F. 风控与安全 — P1

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| 授权边界检测 | 越权自动拦 | 支付宝意图安全 |
| 行为异常 | 频率、金额、商户漂移 | Agent 行为基线 |
| 幻觉/意图偏移 | 决策与用户指令显著偏离 → 降级为人审 | 支付宝宣称；AP2「可验证意图」原则 |
| 重放与重复付 | 幂等与防双扣 | 支付工程标配 |

## G. 生命周期与治理 — P1

| 能力 | 说明 |
|------|------|
| 授权生命周期 | 创建、修改、过期、吊销、轮换 |
| 多 Agent 策略 | 不同助手不同额度与等级 |
| 企业审批链 | 个人之外：角色/预算 owner（若 B 端） |
| 合规日志保留 | 监管留存周期（Assumption：按司法辖区） |

## H. 商业与互操作 — P2（看定位）

| 能力 | 说明 | 行业对照 |
|------|------|----------|
| 协议对齐 | 选 AP2 或 ACP 之一做「对外方言」 | 开源 refs |
| AI 收/计量 | Agent 对外卖能力时的收款 | 支付宝 AI 收、x402 |
| A2A 代付 | Agent 调另一 Agent 付费工具 | A2A + AP2/x402 |
| 赔付/保险 | 信任冷启动 | 支付宝赔付（重资产） |

## 建议的能力分层（讨论用）

```
P0 信任内核（你已点名 + 直接支撑）
  分级自治 | 策略边界 | 意图固化
  全链路审计（含人话解释）
  实时可见 | 急停 | 取消未决 | 退款入口 | 通知

P1 行业能跑
  Agent/用户/环境身份 | 资金隔离或作用域令牌
  风控与意图偏移降级 | 授权生命周期 | 幂等

P2 看战略再选
  开源协议对齐 | 微支付轨 | AI 收 | 赔付 | 企业审批
```

---

# 本地参考源码

见 `refs/README.md`。已克隆：AP2、ACP、UCP、x402、awesome-agentic-payments。

---

# Final Step（任选）

1. Competitive battle card（对支付宝 / 京东 / AP2）
2. Executive comparison matrix（展开版）
3. 未来两季度产品风险/机会清单
4. 验证上述 Assumption 的发现访谈问题
