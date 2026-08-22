import type { Money } from "./types.js";

export type RailIntent = {
  proposalId: string;
  money: Money;
  purpose: string;
  payeeSummary: string;
};

export type RailResult =
  | { ok: true; railRef: string }
  | { ok: false; error: string };

export type PaymentRail = {
  readonly name: string;
  execute(intent: RailIntent): Promise<RailResult>;
};

export function createMockRail(options?: {
  fail?: boolean;
  railRef?: string;
}): PaymentRail {
  return {
    name: "mock",
    async execute(intent) {
      if (options?.fail) {
        return { ok: false, error: "mock rail failure" };
      }
      return {
        ok: true,
        railRef: options?.railRef ?? `mock_${intent.proposalId}`,
      };
    },
  };
}
