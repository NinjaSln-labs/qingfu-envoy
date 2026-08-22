export type AlipayRailConfig = {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  gateway: string;
  /** Sandbox payee logon id for uni transfer dogfood */
  sandboxPayeeLogonId?: string;
};

function readEnv(primary: string, alias?: string): string | undefined {
  const v = process.env[primary]?.trim();
  if (v) {
    return v;
  }
  if (alias) {
    return process.env[alias]?.trim();
  }
  return undefined;
}

function normalizePem(raw: string): string {
  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw;
}

export function loadAlipayConfigFromEnv(): AlipayRailConfig | null {
  const appId = readEnv("ALIPAY_APP_ID", "AIPAY_APP_ID");
  const privateKey = readEnv("ALIPAY_PRIVATE_KEY", "AIPAY_PRIVATE_KEY");
  const alipayPublicKey = readEnv("ALIPAY_PUBLIC_KEY", "AIPAY_PUBLIC_KEY");
  const gateway =
    readEnv("ALIPAY_GATEWAY", "AIPAY_GATEWAY") ??
    "https://openapi-sandbox.dl.alipaydev.com/gateway.do";

  if (!appId || !privateKey || !alipayPublicKey) {
    return null;
  }

  return {
    appId,
    privateKey: normalizePem(privateKey),
    alipayPublicKey: normalizePem(alipayPublicKey),
    gateway,
    sandboxPayeeLogonId: readEnv(
      "ALIPAY_SANDBOX_PAYEE",
      "AIPAY_SANDBOX_PAYEE",
    ),
  };
}

export function hasAlipaySandboxCredentials(): boolean {
  const cfg = loadAlipayConfigFromEnv();
  return Boolean(cfg?.sandboxPayeeLogonId);
}
