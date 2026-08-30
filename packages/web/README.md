# @qingfu/web — Qingfu Envoy local task surface

Principal Web UI + JSON API over `@qingfu/core`. **127.0.0.1 only** by default.

## IA (PRD)

- Envoy 列表 → 提议列表 → 详情 / 审计时间线
- 动作：允准、驳回、取消、执行、退款、急停、解冻、导出

## Run

```bash
npm run build -w @qingfu/web
node packages/web/dist/server.js
# → http://127.0.0.1:3920
```

Shared store: `QINGFU_DATA_DIR` (same as CLI/MCP).

## Env

| Variable | Default | Description |
|----------|---------|-------------|
| `QINGFU_WEB_HOST` | `127.0.0.1` | Must be localhost |
| `QINGFU_WEB_PORT` | `3920` | HTTP port |
| `QINGFU_DATA_DIR` | `~/.qingfu-envoy/` | Persistence |
| `QINGFU_PRINCIPAL_ID` | `local-principal` | Principal actor id |
| `QINGFU_RAIL` | `mock` | Payment rail: `mock` \| `alipay`（alipay 需 `ALIPAY_*`，无凭证则启动失败，不回落 Mock） |

## API (subset)

- `GET /api/envoys`
- `GET /api/proposals?envoyId=`
- `GET /api/proposals/:id`
- `GET /api/proposals/:id/audit`
- `POST /api/proposals/:id/{approve|reject|cancel|execute|refund}`
- `POST /api/envoys/:id/{freeze|unfreeze}`
