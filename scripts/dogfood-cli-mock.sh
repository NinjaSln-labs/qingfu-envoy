#!/usr/bin/env bash
# Mock CLI dogfood replay — labeled stdout for journal paste.
# Usage: from repo root, after npm run build
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLI="node ${ROOT}/packages/cli/dist/cli.js"
DATA_DIR="${QINGFU_DATA_DIR:-$(mktemp -d)}"
export QINGFU_DATA_DIR="$DATA_DIR"

PROPOSAL_ID="dogfood-$(date +%Y%m%d-%H%M%S)"
ENVOY_ID="agent-1"

echo "QINGFU_DATA_DIR=${DATA_DIR}"
echo ""

step() {
  echo "========== STEP ${1} · ${2} =========="
  echo "\$ ${3}"
  echo "---"
}

step 0 "envoy register" \
  "node packages/cli/dist/cli.js envoy register ${ENVOY_ID} --name dogfood"
$CLI envoy register "$ENVOY_ID" --name dogfood
echo ""

step 1 "propose" \
  "node packages/cli/dist/cli.js propose --envoy ${ENVOY_ID} --id ${PROPOSAL_ID} ..."
$CLI propose \
  --envoy "$ENVOY_ID" \
  --id "$PROPOSAL_ID" \
  --amount "1.00" \
  --purpose "dogfood mock" \
  --payee "mock-payee"
echo ""

step 2 "approve" \
  "node packages/cli/dist/cli.js approve ${PROPOSAL_ID}"
$CLI approve "$PROPOSAL_ID"
echo ""

step 3 "execute" \
  "node packages/cli/dist/cli.js execute ${PROPOSAL_ID}"
$CLI execute "$PROPOSAL_ID"
echo ""

step 4 "export" \
  "node packages/cli/dist/cli.js export --proposal ${PROPOSAL_ID}"
$CLI export --proposal "$PROPOSAL_ID"
echo ""

echo "========== DONE · proposalId=${PROPOSAL_ID} =========="
echo "Paste blocks above into docs/delivery/dogfood-journal.md"
