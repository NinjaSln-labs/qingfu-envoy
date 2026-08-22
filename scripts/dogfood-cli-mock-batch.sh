#!/usr/bin/env bash
# Run N mock CLI dogfood cycles (propose → approve → execute). Each = 1 允准笔.
# Usage: ./scripts/dogfood-cli-mock-batch.sh [COUNT] [LOG_FILE]
set -euo pipefail

COUNT="${1:-20}"
LOG_FILE="${2:-}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="node ${ROOT}/packages/cli/dist/cli.js"
DATA_DIR="${QINGFU_DATA_DIR:-${ROOT}/.dogfood-data}"
export QINGFU_DATA_DIR="$DATA_DIR"

mkdir -p "$DATA_DIR"
if [[ -n "$LOG_FILE" ]]; then
  mkdir -p "$(dirname "$LOG_FILE")"
  : >"$LOG_FILE"
  log() { echo "$@" | tee -a "$LOG_FILE"; }
else
  log() { echo "$@"; }
fi

ENVOY_ID="agent-1"
BATCH_TAG="$(date +%Y%m%d-%H%M%S)"
OK=0
FAIL=0

log "========== DOGFOOD BATCH START =========="
log "QINGFU_DATA_DIR=${DATA_DIR}"
log "COUNT=${COUNT}"
log "BATCH_TAG=${BATCH_TAG}"
log ""

$CLI envoy register "$ENVOY_ID" --name "dogfood-batch" 2>/dev/null || true

for i in $(seq 1 "$COUNT"); do
  PID="batch-${BATCH_TAG}-${i}"
  log "---------- RUN ${i}/${COUNT} · ${PID} ----------"
  if $CLI propose \
    --envoy "$ENVOY_ID" \
    --id "$PID" \
    --amount "1.00" \
    --purpose "dogfood batch ${i}" \
    --payee "mock-payee" \
    && $CLI approve "$PID" \
    && $CLI execute "$PID"; then
    OK=$((OK + 1))
    log "OK ${PID}"
  else
    FAIL=$((FAIL + 1))
    log "FAIL ${PID}"
  fi
  log ""
done

log "========== DOGFOOD BATCH END =========="
log "approved+executed: ${OK}/${COUNT}"
log "failed: ${FAIL}"
log "data_dir: ${DATA_DIR}"

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
