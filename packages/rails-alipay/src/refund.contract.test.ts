import { describe, expect, it } from "vitest";
import { mapExecuteResult, mapRefundResult } from "./refund-map.js";

describe("alipay refund contract", () => {
  it("maps execute success", () => {
    const r = mapExecuteResult(
      { code: "10000", order_id: "o1" },
      "fallback",
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.railRef).toBe("o1");
    }
  });

  it("maps execute failure", () => {
    const r = mapExecuteResult(
      { code: "40004", sub_msg: "execute failed" },
      "fallback",
    );
    expect(r.ok).toBe(false);
  });

  it("maps success", () => {
    const r = mapRefundResult({
      code: "10000",
      msg: "Success",
      trade_no: "t1",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.refundRef).toBe("t1");
    }
  });

  it("maps failed", () => {
    const r = mapRefundResult({
      code: "40004",
      msg: "Business Failed",
      sub_code: "ACQ.INVALID_PARAMETER",
      sub_msg: "bad param",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.kind).toBe("failed");
      expect(r.error).toContain("bad param");
    }
  });

  it("maps rail_unsupported", () => {
    const r = mapRefundResult({
      code: "40004",
      msg: "Business Failed",
      sub_code: "ACQ.REFUND_NOT_ALLOW",
      sub_msg: "not allowed",
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.kind).toBe("rail_unsupported");
    }
  });
});
