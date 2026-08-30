# @qingfu/cli · qingfu

主理人 CLI：在本地 Mock 轨上完成 **提议 → 确认 → 执行 → 导出 → 退款**。

数据目录：`~/.qingfu-envoy/`（或 `QINGFU_DATA_DIR`）。

## 安装（ monorepo 内）

```bash
cd /path/to/qingfu-envoy
npm install
npm run build
```

## ≤10 分钟 Dogfood（Mock）

以下命令假设你在仓库根目录，且已 `npm run build`。

### 1. 注册 Envoy（约 1 分钟）

```bash
node packages/cli/dist/cli.js envoy register agent-1 --name "我的助手"
```

### 2. 提议一笔付款（Agent 侧动作模拟）

```bash
node packages/cli/dist/cli.js propose \
  --envoy agent-1 \
  --id demo-001 \
  --amount 12.50 \
  --purpose "测试咖啡" \
  --payee "示例咖啡店"
```

### 3. 查看待办

```bash
node packages/cli/dist/cli.js list
```

### 4. 主理人允准

```bash
node packages/cli/dist/cli.js approve demo-001
```

### 5. 执行（Mock 轨）

```bash
node packages/cli/dist/cli.js execute demo-001
# 或显式：
node packages/cli/dist/cli.js execute demo-001 --rail mock
```

支付宝 sandbox（需 `.env` 中 `ALIPAY_*`，缺凭证会报错且**不会**静默回落 Mock）：

```bash
node packages/cli/dist/cli.js execute demo-001 --rail alipay
# 或：QINGFU_RAIL=alipay node packages/cli/dist/cli.js execute demo-001
```
### 6. 导出审计 JSON

```bash
node packages/cli/dist/cli.js export --proposal demo-001
```

应看到 `propose` → `approve` → `execute` 三条 `scope: proposal` 事件。

### 7. 退款请求（可选）

```bash
node packages/cli/dist/cli.js refund demo-001
```

### 8. 急停演练

```bash
node packages/cli/dist/cli.js freeze --envoy agent-1
node packages/cli/dist/cli.js propose --envoy agent-1 --id demo-002 --amount 1.00 --purpose x --payee y
# 应失败：Envoy frozen
node packages/cli/dist/cli.js unfreeze --envoy agent-1
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `QINGFU_DATA_DIR` | 数据目录，默认 `~/.qingfu-envoy` |
| `QINGFU_PRINCIPAL_ID` | 主理人 ID（审计 actor），默认 `local-principal` |
| `QINGFU_RAIL` | `mock`（默认）或 `alipay`；也可用全局/`execute`/`refund` 的 `--rail` |

## 帮助

```bash
node packages/cli/dist/cli.js help
```
