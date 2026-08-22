# Dogfood 周记 · ADR 002

> **自测阶段**（当前）：不填放心拍；允准笔数可用 **batch 脚本** 累计。  
> 完整逐步输出见 `docs/delivery/logs/`（本地 `*.log`，不入库）。

指标：[success-metrics.md](../product/success-metrics.md) · 硬门禁：**无人确认扣款 = 0**。

```bash
# 单笔带 STEP 标签
./scripts/dogfood-cli-mock.sh

# 累计允准笔（默认 20）
./scripts/dogfood-cli-mock-batch.sh 20 docs/delivery/logs/dogfood-batch-YYYYMMDD.log
```

数据目录默认：仓库内 `.dogfood-data/`（gitignore），与日常 `~/.qingfu-envoy` 隔离。

---

## 汇总

| 周次 | 日期 | 允准笔数 | 记录方式 | 无人确认扣款 | 备注 |
|------|------|----------|----------|--------------|------|
| W1 | 2026-08-22 | **21** | 手工 demo-001 + batch 20/20 | **0** | 自测，无放心拍 |

**累计允准：** **21 / 20** ✅（含 demo-001 1 笔 + batch 20 笔）  
**D8 反指标：** execute 前均有 approve（脚本 + audit 核对 0 违规）

---

## 已记录

### 2026-08-22 · 笔 #1 · 手工自测

- **ID：** demo-001（`~/.qingfu-envoy`）
- **判定：** audit 3 事件链完整（已核对）

### 2026-08-22 · batch · 20 笔允准

- **命令：** `./scripts/dogfood-cli-mock-batch.sh 20 docs/delivery/logs/dogfood-batch-20260822.log`
- **结果：** approved+executed **20/20**，failed 0
- **数据：** `.dogfood-data/` · tag `batch-20260822-230307-*`
- **判定：**
  - propose / approve / execute 各 20 条
  - `execute_without_approve: 0`
  - 日志：`docs/delivery/logs/dogfood-batch-20260822.log`（本地）

---

## 单笔粘贴模板（可选，手工时）

见 [cli-mock-step-reference.md](./cli-mock-step-reference.md)。

```markdown
#### STEP 1 · propose
#### STEP 2 · approve
#### STEP 3 · execute
#### STEP 4 · export
#### 判定（Agent 填）
```
