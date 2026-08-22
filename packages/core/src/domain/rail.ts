import type { Money } from "./money.js";

export type RailIntent = {
  proposalId: string;
  money: Money;
  purpose: string;
  payeeSummary: string;
};

export type RailResult =
  | { ok: true; railRef: string }
  | { ok: false; error: string };

export type RefundIntent = {
  proposalId: string;
  railRef: string;
  money: Money;
};

export type RefundResult =
  | { ok: true; refundRef: string }
  | { ok: false; error: string; kind?: "failed" | "rail_unsupported" };

export type PaymentRail = {
  readonly name: string;
  execute(intent: RailIntent): Promise<RailResult>;
  refund(intent: RefundIntent): Promise<RefundResult>;
};

export type MockRailOptions = {
  failExecute?: boolean;
  failRefund?: boolean;
  railRef?: string;
  refundRef?: string;
  refundUnsupported?: boolean;
};

export function createMockRail(options?: MockRailOptions): PaymentRail {
  return {
    name: "mock",
    async execute(intent) {
      if (options?.failExecute) {
        return { ok: false, error: "mock rail failure" };
      }
      return {
        ok: true,
        railRef: options?.railRef ?? `mock_${intent.proposalId}`,
      };
    },
    async refund(intent) {
      if (options?.refundUnsupported) {
        return {
          ok: false,
          error: "mock rail does not support refund",
          kind: "rail_unsupported",
        };
      }
      if (options?.failRefund) {
        return { ok: false, error: "mock refund failure", kind: "failed" };
      }
      return {
        ok: true,
        refundRef: options?.refundRef ?? `mock_refund_${intent.proposalId}`,
      };
    },
  };
}
