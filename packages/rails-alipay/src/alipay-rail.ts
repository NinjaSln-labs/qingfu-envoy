import type {
  PaymentRail,
  RailIntent,
  RefundIntent,
} from "@qingfu/core";
import { AlipaySdk } from "alipay-sdk";
import type { AlipayRailConfig } from "./config.js";
import { mapExecuteResult, mapRefundResult } from "./refund-map.js";

export function createAlipayRail(config: AlipayRailConfig): PaymentRail {
  const client = new AlipaySdk({
    appId: config.appId,
    privateKey: config.privateKey,
    alipayPublicKey: config.alipayPublicKey,
    gateway: config.gateway,
  });

  return {
    name: "alipay-sandbox",
    async execute(intent: RailIntent) {
      if (!config.sandboxPayeeLogonId) {
        return {
          ok: false,
          error:
            "ALIPAY_SANDBOX_PAYEE required for sandbox uni transfer execute",
        };
      }

      const response = await client.exec("alipay.fund.trans.uni.transfer", {
        bizContent: {
          outBizNo: intent.proposalId,
          transAmount: intent.money.amount,
          productCode: "TRANS_ACCOUNT_NO_PWD",
          bizScene: "DIRECT_TRANSFER",
          orderTitle: intent.purpose,
          payeeInfo: {
            identityType: "ALIPAY_LOGON_ID",
            identity: config.sandboxPayeeLogonId,
          },
        },
      });

      return mapExecuteResult(response, intent.proposalId);
    },

    async refund(intent: RefundIntent) {
      const response = await client.exec("alipay.trade.refund", {
        bizContent: {
          outTradeNo: intent.proposalId,
          tradeNo: intent.railRef,
          refundAmount: intent.money.amount,
          outRequestNo: `refund_${intent.proposalId}`,
        },
      });

      return mapRefundResult(response);
    },
  };
}
