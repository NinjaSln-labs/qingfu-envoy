import { DomainError } from "./types.js";

export type Money = {
  readonly amount: string;
  readonly currency: string;
};

/** V1 supported currencies and their minor-unit scale (e.g. CNY → 2 = 分). */
const CURRENCY_DECIMALS: Record<string, number> = {
  CNY: 2,
};

const DECIMAL_PATTERN = /^\d+(\.\d+)?$/;

/**
 * Parse and normalize a payment amount. Uses integer minor units internally — no float.
 * Rejects scientific notation, negative/zero, excess decimals, unsupported currency.
 */
export function parseMoney(amount: string, currency: string): Money {
  const cur = currency.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(cur)) {
    throw new DomainError("currency must be a 3-letter ISO code");
  }

  const decimals = CURRENCY_DECIMALS[cur];
  if (decimals === undefined) {
    throw new DomainError(`unsupported currency: ${cur}`);
  }

  const raw = amount.trim();
  if (!raw) {
    throw new DomainError("amount is required");
  }
  if (/[eE+-]/.test(raw)) {
    throw new DomainError("amount must be a plain positive decimal");
  }
  if (!DECIMAL_PATTERN.test(raw)) {
    throw new DomainError("amount must be a plain positive decimal");
  }

  const [wholePart, fracPart = ""] = raw.split(".");
  if (fracPart.length > decimals) {
    throw new DomainError(
      `amount exceeds ${decimals} decimal places for ${cur}`,
    );
  }

  const scale = BigInt(10 ** decimals);
  const whole = BigInt(wholePart);
  const frac = BigInt(fracPart.padEnd(decimals, "0"));
  const minor = whole * scale + frac;

  if (minor <= 0n) {
    throw new DomainError("amount must be positive");
  }

  const normalizedWhole = minor / scale;
  const normalizedFrac = (minor % scale).toString().padStart(decimals, "0");
  const normalizedAmount =
    decimals > 0
      ? `${normalizedWhole}.${normalizedFrac}`
      : `${normalizedWhole}`;

  return { amount: normalizedAmount, currency: cur };
}

/** Re-validate persisted money (load-time integrity). */
export function assertValidMoney(money: Money): Money {
  return parseMoney(money.amount, money.currency);
}
