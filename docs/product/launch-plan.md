# Launch Plan · 青蚨使（开源首发）

- Status: draft-ready（发布时执行；文档齐全供审计）
- 指标回检：`docs/product/success-metrics.md`
- 定位：`docs/product/product-marketing.md`

## 五阶段

| 阶段 | 动作 | 退出 |
|------|------|------|
| 1. Dogfood | 002：≥20 笔或 4 周周记；无人确认扣款=0 | D8 leading 达标 |
| 2. Private | 邀请 ≤10 名开发者装 CLI；收 Issue | 有书面反馈 |
| 3. Public repo | GitHub 公开；Apache-2.0；README 定位正确 | star/issue 可观测 |
| 4. Announce | ORB：自有（博客/README）+ 租用（推文可选）+ 借用（相关论坛/开源周刊投稿） | 首周流量记录 |
| 5. Iterate | 按 Issue 排 V1.1（微信轨等） | 新 ADR/ tickets |

## ORB 渠道（开源）

| 类型 | 渠道 |
|------|------|
| Owned | README、docs、自有博客 |
| Rented | 个人社媒 |
| Borrowed | GitHub trending 不强求；中文开源社群/Agent 主题帖 |

## 检查清单（发布日）

- [ ] ADR 001–004 与 PRD 链接在 README  
- [ ] 无私钥；`.env` 示例无真实密钥  
- [ ] `npm test` 绿；S0–S1 至少 DoD 绿  
- [ ] 明确「非支付牌照/非静默代扣」  
- [ ] D8 反指标：无人确认扣款=0  

## 回滚

发现静默路径或密钥泄漏：立刻 yank release、轮换密钥、发安全说明。
