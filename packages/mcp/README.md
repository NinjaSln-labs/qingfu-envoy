# @qingfu/mcp — Qingfu Envoy MCP server

Envoy-facing MCP tools over the shared `@qingfu/core` store. **No blind execute** — principal approval and execution stay on CLI / Web.

## Tools

| Tool | Actor | Description |
|------|-------|-------------|
| `envoy_propose` | Envoy | Create payment proposal |
| `envoy_list` | Envoy | List proposals |
| `envoy_get` | Envoy | Get proposal by id |
| `envoy_cancel` | Envoy | Cancel proposed payment |
| `envoy_status` | Envoy | Poll status |

## E2E dogfood (≤10 min)

Shared data dir: `QINGFU_DATA_DIR` (default `~/.qingfu-envoy/`).

### 1. Register envoy (CLI)

```bash
npm run build -w @qingfu/cli
node packages/cli/dist/cli.js envoy register e1 --name demo
```

### 2. MCP propose

Configure your MCP client to run:

```bash
node packages/mcp/dist/server.js
```

Call tool `envoy_propose`:

```json
{
  "envoyId": "e1",
  "proposalId": "mcp-p1",
  "amount": "10.00",
  "purpose": "coffee",
  "payee": "cafe"
}
```

### 3. Principal approve + execute (CLI)

```bash
node packages/cli/dist/cli.js approve mcp-p1
node packages/cli/dist/cli.js execute mcp-p1
```

### 4. MCP status

Call `envoy_status` with `{ "proposalId": "mcp-p1" }` — expect `"status": "executed"`.

## Env

- `QINGFU_DATA_DIR` — persistence directory (same as CLI)
- MCP does **not** expose `execute` / `approve` / `reject` / `refund` / `freeze` tools
