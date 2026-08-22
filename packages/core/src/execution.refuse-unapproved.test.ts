import { describe, expect, it } from "vitest";
import { createMemoryAuditSink } from "./domain/audit.js";
import { executeApproved } from "./domain/execution.js";
import { propose } from "./domain/proposal.js";
import { createMockRail } from "./domain/rail.js";
import { DomainError } from "./domain/types.js";

describe("execution.refuse-unapproved", () => {
  it("refuses execute when not approved", async () => {
    const p = propose({
      id: "p1",
      envoyId: "e1",
      money: { amount: "1", currency: "CNY" },
      purpose: "x",
      payeeSummary: "y",
    });

    await expect(
      executeApproved(p, createMockRail(), createMemoryAuditSink(), {
        actor: { kind: "system" },
        auditId: "a1",
      }),
    ).rejects.toThrow(DomainError);
  });
});
