# Dogfood 周记 · ADR 002

> **自测阶段**（当前）：不填放心拍；把 CLI 每步**完整终端输出**贴进单笔记录，由维护者/Agent 对照审计判定。  
> **后续**（Private beta / 真实顾虑）：再启用放心拍 1–5。

指标：[success-metrics.md](../product/success-metrics.md) · 硬门禁：**无人确认扣款 = 0**。

**Mock 路径代码已由 `npm test` 覆盖**；自测不必重复人肉验证逻辑。可选：

- 跑脚本生成带步骤标签的输出 → 贴进下文  
- 或只记「已跑脚本 / 日期」

```bash
# 仓库根目录，隔离数据目录
./scripts/dogfood-cli-mock.sh
```

---

## 汇总（每周更新）

| 周次 | 日期 | 允准笔数 | 记录方式 | 无人确认扣款 | 备注 |
|------|------|----------|----------|--------------|------|
| W1 | | 0 | 贴输出 / 脚本 | 0 | 自测，无放心拍 |

**累计允准（自测笔数）：** 0 / 20（满 20 或 4 周后再看是否进入 Private beta）

---

## 单笔记录模板（复制使用）

```markdown
### YYYY-MM-DD · 笔 #N · 自测

- **方式：** 手工 CLI | `scripts/dogfood-cli-mock.sh`
- **轨：** mock
- **提议 ID：**

#### STEP 1 · propose
（整段终端输出粘贴于此）

#### STEP 2 · approve
（整段终端输出粘贴于此）

#### STEP 3 · execute
（整段终端输出粘贴于此）

#### STEP 4 · export
（整段终端输出粘贴于此）

#### 判定（维护者填，或 Agent 根据上文输出填）
- status 递进：proposed → approved → executed
- export 事件链：3 条，execute 前有 approve
- 无人确认扣款：是 / 否
```

---

## 已记录

### 2026-08-22 · 笔 #1 · 自测

- **方式：** 手工 CLI
- **轨：** mock
- **提议 ID：** demo-001

（输出可后补粘贴；审计文件已核对：audit.jsonl 三事件链完整）

---

## CLI 每步输出应长什么样（对照用）

见 [cli-mock-step-reference.md](./cli-mock-step-reference.md)。
