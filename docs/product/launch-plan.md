# Launch Plan · 青蚨使（开源首发）

- Status: **v0.1.0 已发布**（2026-08-22）→ **首发传播**（短文待发）· Private beta 待名单
- 指标回检：`docs/product/success-metrics.md`
- 定位：README / ROADMAP 对外表述

## 五阶段

| 阶段 | 动作 | 退出 |
|------|------|------|
| 1. Dogfood | 002：≥20 笔或 4 周周记；无人确认扣款=0 | D8 leading 达标 |
| 2. Private | 邀请 ≤10 名开发者装 CLI；收 Issue | 有书面反馈 |
| 3. Public repo | GitHub 公开；Apache-2.0；README 定位正确 | ✅ 2026-08-22 |
| 4. Announce | ORB：README/docs + [v0.1.0 公告稿](announce-v0.1.0.md) + 可选社媒/社群 | Release 已发；短文待发 |
| 5. Iterate | 按 Issue 排 V1.1（微信轨等） | 新 ADR / tickets |

## ORB 渠道（开源）

| 类型 | 渠道 |
|------|------|
| Owned | README、docs、自有博客 |
| Rented | 个人社媒 |
| Borrowed | GitHub trending 不强求；中文开源社群/Agent 主题帖 |

## 检查清单（V1 标签前）

### 代码与门禁

- [x] ADR 001–004 与 PRD 链接在 README  
- [x] 无私钥；`.env` 示例无真实密钥（`.env` gitignore）  
- [x] `npm test` 绿；**S1–S5 DoD** 全绿（62 tests + rails sandbox skip）  
- [x] 三端垂直切片可演示（CLI / MCP / Web README）  
- [x] 明确「非支付牌照/非静默代扣」  
- [x] GitHub Issues #2–#16 闭合  

### Dogfood（ADR 002 · 发布阻断项）

- [x] dogfood ≥20 笔允准（2026-08-22：21 笔，batch 20/20；台账维护者本地）
- [x] D8 反指标：**无人确认扣款 = 0**（audit 核对 + CI）
- [ ] 北极星放心拍：延后至 Private beta

### 可选增强（不挡 V1 标签）

- [ ] 支付宝 sandbox 凭证跑通 `execute.sandbox.test.ts`  
- [ ] CLI/Web `--rail alipay` 壳层开关  

## 回滚

发现静默路径或密钥泄漏：立刻 yank release、轮换密钥、发安全说明（[SECURITY.md](../SECURITY.md)）。
