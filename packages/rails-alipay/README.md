# @qingfu/rails-alipay

Alipay Open Platform `PaymentRail` adapter for Qingfu Envoy (sandbox first).

## Config (no secrets in repo)

Copy `.env.example` → `.env` (gitignored):

| Variable | Required for live sandbox test |
|----------|-------------------------------|
| `ALIPAY_APP_ID` | yes |
| `ALIPAY_PRIVATE_KEY` | yes (PEM, `\n` escaped ok) |
| `ALIPAY_PUBLIC_KEY` | yes |
| `ALIPAY_GATEWAY` | default sandbox gateway |
| `ALIPAY_SANDBOX_PAYEE` | yes for `execute` dogfood |

Aliases `AIPAY_*` accepted per implementation plan.

## Tests

- `refund.contract.test.ts` — refund success / failed / `rail_unsupported` mapping
- `execute.sandbox.test.ts` — **skipped** unless full sandbox env + payee set

## Usage

```typescript
import { createAlipayRail, loadAlipayConfigFromEnv } from "@qingfu/rails-alipay";

const config = loadAlipayConfigFromEnv();
if (config) {
  const rail = createAlipayRail(config);
  // plug into ProposalService(store, rail)
}
```
