# CLI Mock 路径 · 分步输出对照

每笔提议走四步；**成功时 stdout 为 JSON**，无额外成功文案。失败时 stderr：`error: ...`，退出码非 0。

---

## STEP 1 · `propose`

```bash
node packages/cli/dist/cli.js propose \
  --envoy agent-1 --id demo-001 --amount 12.50 \
  --purpose "测试咖啡" --payee "示例咖啡店"
```

**期望：** `status` 为 **`proposed`**，尚无 `railRef`。

```json
{
  "id": "demo-001",
  "envoyId": "agent-1",
  "money": { "amount": "12.50", "currency": "CNY" },
  "purpose": "测试咖啡",
  "payeeSummary": "示例咖啡店",
  "status": "proposed",
  "createdAt": "2026-08-22T13:45:01.274Z"
}
```

---

## STEP 2 · `approve`

```bash
node packages/cli/dist/cli.js approve demo-001
```

**期望：** 同一 `id`，`status` 变为 **`approved`**。

```json
{
  "id": "demo-001",
  "envoyId": "agent-1",
  "money": { "amount": "12.50", "currency": "CNY" },
  "purpose": "测试咖啡",
  "payeeSummary": "示例咖啡店",
  "status": "approved",
  "createdAt": "2026-08-22T13:45:01.274Z"
}
```

---

## STEP 3 · `execute`

```bash
node packages/cli/dist/cli.js execute demo-001
```

**期望：** `status` 为 **`executed`**，出现 **`railRef`**（Mock 轨）。

```json
{
  "id": "demo-001",
  "envoyId": "agent-1",
  "money": { "amount": "12.50", "currency": "CNY" },
  "purpose": "测试咖啡",
  "payeeSummary": "示例咖啡店",
  "status": "executed",
  "createdAt": "2026-08-22T13:45:01.274Z",
  "railRef": "mock_demo-001"
}
```

若跳过 STEP 2 直接 execute → **失败**（门禁）。

---

## STEP 4 · `export`

```bash
node packages/cli/dist/cli.js export --proposal demo-001
```

**期望：** JSON **数组**，3 条，顺序 propose → approve → execute。

```json
[
  {
    "action": "propose",
    "from": null,
    "to": "proposed",
    "actor": { "kind": "envoy", "id": "agent-1" }
  },
  {
    "action": "approve",
    "from": "proposed",
    "to": "approved",
    "actor": { "kind": "principal", "id": "local-principal" }
  },
  {
    "action": "execute",
    "from": "approved",
    "to": "executed",
    "actor": { "kind": "principal", "id": "local-principal" },
    "detail": { "rail": "mock", "railRef": "mock_demo-001" }
  }
]
```

（完整事件含 `id`、`at`、`scope` 等字段；判定看 `action` / `from` / `to` / `actor` 即可。）

---

## 可选 · `refund`

```bash
node packages/cli/dist/cli.js refund demo-001
```

**期望：** `status` → **`refunded`**；export 多一条 refund 相关事件。
