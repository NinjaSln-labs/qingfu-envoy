import { createMockRail, type PaymentRail } from "@qingfu/core";
import {
  createAlipayRail,
  loadAlipayConfigFromEnv,
} from "@qingfu/rails-alipay";

export type RailName = "mock" | "alipay";

export function parseRailName(raw: string | undefined): RailName {
  const v = (raw ?? "mock").trim().toLowerCase();
  if (v === "" || v === "mock") {
    return "mock";
  }
  if (v === "alipay") {
    return "alipay";
  }
  throw new Error(`unknown rail "${raw}"; use mock|alipay`);
}

export function defaultRailName(): RailName {
  return parseRailName(process.env.QINGFU_RAIL);
}

/** Resolve PaymentRail. Alipay must not fall back to Mock when credentials are missing. */
export function resolvePaymentRail(name: RailName): PaymentRail {
  if (name === "mock") {
    return createMockRail();
  }
  const config = loadAlipayConfigFromEnv();
  if (!config) {
    throw new Error(
      "alipay rail requires ALIPAY_APP_ID, ALIPAY_PRIVATE_KEY, and ALIPAY_PUBLIC_KEY (see .env.example); refusing to fall back to mock",
    );
  }
  return createAlipayRail(config);
}
