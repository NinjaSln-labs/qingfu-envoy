#!/usr/bin/env bash
# One-shot: tickets.md → GitHub Issues. Aborts if issues already exist.
set -euo pipefail
REPO="${REPO:-NinjaSln-labs/qingfu-envoy}"
MAP_FILE="${MAP_FILE:-/tmp/qingfu-issue-map.txt}"

existing=$(gh issue list --repo "$REPO" --state all --limit 1 --json number --jq 'length')
if [ "$existing" -gt 0 ]; then
  echo "Issues already exist on $REPO; see docs/delivery/tickets.md. Abort."
  exit 1
fi

: >"$MAP_FILE"

create_issue() {
  local ticket="$1" milestone="$2" label="$3" title="$4" body="$5"
  local num
  num=$(gh api "repos/$REPO/issues" \
    -f title="[$ticket] $title" \
    -f body="$body" \
    -f milestone="$milestone" \
    -f "labels[]=$label" \
    --jq '.number')
  echo "$ticket $num" >>"$MAP_FILE"
  echo "created #$num [$ticket]"
}

FOOTER=$(
  cat <<'EOF'

---
**权威 AC：** 以 [stage-spec DoD](https://github.com/NinjaSln-labs/qingfu-envoy/tree/main/docs/design/stage-specs) 为准，本 Issue 为 tracer bullet。
**纪律：** [ADR 001](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/decisions/001-no-license-no-silent-pay.md) — 禁止静默自付。
EOF
)

create_issue T0.1 2 documentation "实施计划定稿+审计" "$(cat <<EOF
## 任务
S0 · 实施计划全文 + [IMPLEMENTATION-PLAN-AUDIT](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/IMPLEMENTATION-PLAN-AUDIT.md) 通过。

## 计划任务
implementation-plan-v1 · S0 完成

## 状态
✅ 已完成（文档阶段）
$FOOTER
EOF
)"
gh issue close "$(grep '^T0.1 ' "$MAP_FILE" | awk '{print $2}')" --repo "$REPO" --comment "S0 已完成；关闭作追溯。"

create_issue T1.0 3 S1 "生命周期+持久化+审计" "$(cat <<EOF
## 依赖
- T0.1 ✅

## 计划任务
S1.0 · [implementation-plan-v1 § S1.0](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/implementation-plan-v1.md)

## AC 摘要
- lifecycle.audit.test.ts：propose/approve/reject/cancel 审计
- app/proposal-service.ts + persistence/json-store.ts
- 非法状态迁移失败
- Verify: npm test

## Stage-spec
[S1.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S1.md)
$FOOTER
EOF
)"

# Remaining tickets: use escaped backticks in heredocs without quotes only where needed
# ... rest similar without backticks or use plain text

create_issue T1.1 3 S1 "refund + MockRail" "$(cat <<EOF
## 依赖
- T1.0

## 计划任务
S1.1

## AC 摘要
- refund.state.test.ts
- refunded / refund_failed；rail.refund；app/refund-service.ts
- MockRail refund 成功/失败
- Verify: npm test

## Stage-spec
[S1.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S1.md)
$FOOTER
EOF
)"

create_issue T1.2 3 S1 "freeze/unfreeze 语义" "$(cat <<EOF
## 依赖
- T1.0

## 计划任务
S1.2 · ADR 004

## AC 摘要
- frozen 不可 propose；已 approved 可 execute
- unfreeze；envoy.freeze-semantics.test.ts
- Verify: npm test

## Stage-spec
[S1.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S1.md)
$FOOTER
EOF
)"

create_issue T1.3 3 S1 "禁未批+无静默符号" "$(cat <<EOF
## 依赖
- T1.0

## 计划任务
S1.3 · P0-7

## AC 摘要
- execution.refuse-unapproved.test.ts
- 无 silent / autoPay / executeWithoutApproval 符号
- Verify: npm test && npm run build

## Stage-spec
[S1.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S1.md)
$FOOTER
EOF
)"

create_issue T1.4 3 S1 "导出 helper" "$(cat <<EOF
## 依赖
- T1.0

## 计划任务
S1.4 · P0-10

## AC 摘要
- export-audit.test.ts：JSON 含 actor/from/to
- app/export-audit.ts
- Verify: npm test

## Stage-spec
[S1.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S1.md)
$FOOTER
EOF
)"

create_issue T1.5 3 S1 "错误态契约测试" "$(cat <<EOF
## 依赖
- T1.0

## 计划任务
S1.5

## AC 摘要
- error-states.test.ts：缺字段、未批准执行、冻结后 propose、重复 execute
- Verify: npm test

## Stage-spec
[S1.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S1.md) DoD 全勾选 = M1 完成
$FOOTER
EOF
)"

create_issue T2.0 4 S2 "workspaces" "$(cat <<EOF
## 依赖
- S1 DoD 全绿

## 计划任务
S2.0

## AC 摘要
- 根 package.json workspaces 加入 cli
- Verify: npm install 无报错

## Stage-spec
[S2.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S2.md)
$FOOTER
EOF
)"

create_issue T2.1 4 S2 "CLI scaffold" "$(cat <<EOF
## 依赖
- T2.0

## 计划任务
S2.1

## AC 摘要
- packages/cli、bin qingfu、依赖 @qingfu/core
- Verify: qingfu --help

## Stage-spec
[S2.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S2.md)
$FOOTER
EOF
)"

create_issue T2.2 4 S2 "CLI 命令全路径" "$(cat <<EOF
## 依赖
- T2.1

## 计划任务
S2.2

## AC 摘要
- 命令：propose list approve reject cancel execute refund export freeze unfreeze
- 数据 ~/.qingfu-envoy/
- Verify: cli/happy-path.test.ts

## Stage-spec
[S2.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S2.md)
$FOOTER
EOF
)"

create_issue T2.3 4 S2 "CLI dogfood 文档" "$(cat <<EOF
## 依赖
- T2.2

## 计划任务
S2.3

## AC 摘要
- packages/cli/README.md ≤10 分钟 Mock 步骤
- Verify: 人工走通一笔

## Stage-spec
[S2.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S2.md) DoD = M2 完成
$FOOTER
EOF
)"

create_issue T3.1 5 S3 "MCP 工具+禁盲执行" "$(cat <<EOF
## 依赖
- S2 DoD 全绿

## 计划任务
S3.1

## AC 摘要
- 工具：propose list get cancel status
- **无** blind execute；可选 QINGFU_PRINCIPAL_TOKEN
- Verify: mcp/propose.test.ts、mcp/no-blind-execute.test.ts

## Stage-spec
[S3.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S3.md)
$FOOTER
EOF
)"

create_issue T3.2 5 S3 "MCP E2E 文档" "$(cat <<EOF
## 依赖
- T3.1

## 计划任务
S3.2

## AC 摘要
- MCP 提议 + CLI approve + status 见 executed
- Verify: 文档可重复

## Stage-spec
[S3.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S3.md) DoD = M3 完成
$FOOTER
EOF
)"

create_issue T4.1 6 S4 "Web 任务面" "$(cat <<EOF
## 依赖
- S2 DoD 全绿（可与 S3 并行）

## 计划任务
S4.1

## AC 摘要
- IA：Envoy / 提议 / 详情 / 审计时间线
- 动作：允准、驳回、取消、急停、解冻、导出、退款请求
- 127.0.0.1 only
- Verify: web/list.spec.ts + PRD IA 勾选

## Stage-spec
[S4.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S4.md) DoD = M4 完成
$FOOTER
EOF
)"

create_issue T5.1 7 S5 "支付宝 execute" "$(cat <<EOF
## 依赖
- S2 DoD 全绿

## 计划任务
S5.1

## AC 摘要
- packages/rails-alipay；env ALIPAY_*
- 无 env：集成测试 skip
- Verify: rails-alipay/execute.sandbox.test.ts

## Stage-spec
[S5.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S5.md)
$FOOTER
EOF
)"

create_issue T5.2 7 S5 "支付宝 refund" "$(cat <<EOF
## 依赖
- T5.1

## 计划任务
S5.2

## AC 摘要
- refund 三分支：成功 / 失败 / rail_unsupported
- Verify: 测试或 ADR 脚注

## Stage-spec
[S5.md](https://github.com/NinjaSln-labs/qingfu-envoy/blob/main/docs/design/stage-specs/S5.md) DoD = M5 完成
$FOOTER
EOF
)"

echo "--- issue map ---"
cat "$MAP_FILE"
