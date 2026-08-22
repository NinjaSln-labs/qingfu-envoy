import { describe, expect, it } from "vitest";
import { parseMoney } from "./domain/money.js";
import { DomainError } from "./domain/types.js";

describe("parseMoney", () => {
  it("normalizes CNY to two decimal places", () => {
    expect(parseMoney("12.5", "CNY")).toEqual({
      amount: "12.50",
      currency: "CNY",
    });
    expect(parseMoney("1", "cny")).toEqual({
      amount: "1.00",
      currency: "CNY",
    });
  });

  it("rejects zero and negative", () => {
    expect(() => parseMoney("0", "CNY")).toThrow(DomainError);
    expect(() => parseMoney("0.00", "CNY")).toThrow(DomainError);
  });

  it("rejects scientific notation and non-decimal", () => {
    expect(() => parseMoney("1e2", "CNY")).toThrow(DomainError);
    expect(() => parseMoney("abc", "CNY")).toThrow(DomainError);
    expect(() => parseMoney("1.2.3", "CNY")).toThrow(DomainError);
    expect(() => parseMoney("-1", "CNY")).toThrow(DomainError);
  });

  it("rejects excess decimal places for CNY", () => {
    expect(() => parseMoney("1.234", "CNY")).toThrow(DomainError);
  });

  it("rejects unsupported currency", () => {
    expect(() => parseMoney("1.00", "USD")).toThrow(DomainError);
  });

  it("rejects invalid currency code", () => {
    expect(() => parseMoney("1.00", "CN")).toThrow(DomainError);
  });
});
