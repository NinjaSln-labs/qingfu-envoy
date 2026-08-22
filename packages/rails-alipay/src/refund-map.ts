import type { RefundResult } from "@qingfu/core";

export type AlipayCommonShape = {
  code?: string;
  msg?: string;
  sub_code?: string;
  sub_msg?: string;
  trade_no?: string;
  out_request_no?: string;
  order_id?: string;
};

const UNSUPPORTED_SUB_CODES = new Set([
  "ACQ.REFUND_NOT_ALLOW",
  "ACQ.TRADE_NOT_EXIST",
  "ACQ.SYSTEM_ERROR",
]);

export function mapExecuteResult(
  response: AlipayCommonShape,
  fallbackRef: string,
): { ok: true; railRef: string } | { ok: false; error: string } {
  if (response.code === "10000") {
    const railRef =
      response.order_id ?? response.trade_no ?? fallbackRef;
    return { ok: true, railRef };
  }
  return {
    ok: false,
    error: response.sub_msg ?? response.msg ?? "alipay execute failed",
  };
}

export function mapRefundResult(response: AlipayCommonShape): RefundResult {
  if (response.code === "10000") {
    return {
      ok: true,
      refundRef:
        response.trade_no ??
        response.out_request_no ??
        `alipay_refund_${Date.now()}`,
    };
  }

  if (UNSUPPORTED_SUB_CODES.has(response.sub_code ?? "")) {
    return {
      ok: false,
      error: response.sub_msg ?? response.sub_code ?? "rail_unsupported",
      kind: "rail_unsupported",
    };
  }

  return {
    ok: false,
    error: response.sub_msg ?? response.msg ?? "alipay refund failed",
    kind: "failed",
  };
}
