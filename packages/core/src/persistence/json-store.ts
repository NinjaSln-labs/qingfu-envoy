import fs from "node:fs";
import fsPromises from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { AuditEvent } from "../domain/types.js";
import { createMemoryAuditSink } from "../domain/audit.js";
import { createEnvoy, type Envoy } from "../domain/envoy.js";
import { assertValidMoney } from "../domain/money.js";
import type { PaymentProposal } from "../domain/proposal.js";
import { DomainError } from "../domain/types.js";
import {
  appendLineFsync,
  withDataDirLock,
  writeFileAtomicFsync,
} from "./fs-hardening.js";
import {
  createPersistingAuditSink,
  type DataStore,
} from "./store.js";

const PROPOSALS_FILE = "proposals.json";
const ENVOYS_FILE = "envoys.json";
const AUDIT_FILE = "audit.jsonl";

export function defaultDataDir(): string {
  return process.env.QINGFU_DATA_DIR ?? path.join(os.homedir(), ".qingfu-envoy");
}

export class JsonStore implements DataStore {
  private envoys = new Map<string, Envoy>();
  private proposals = new Map<string, PaymentProposal>();
  private innerAudit = createMemoryAuditSink();
  readonly audit: DataStore["audit"];

  private constructor(private readonly dir: string) {
    this.audit = createPersistingAuditSink(this.innerAudit, (event) => {
      this.appendAuditLine(event);
    });
  }

  static async open(dir: string = defaultDataDir()): Promise<JsonStore> {
    const store = new JsonStore(dir);
    await fsPromises.mkdir(dir, { recursive: true });
    await store.load();
    return store;
  }

  getEnvoy(id: string): Envoy | undefined {
    return this.envoys.get(id);
  }

  listEnvoys(): Envoy[] {
    return [...this.envoys.values()];
  }

  saveEnvoy(envoy: Envoy): void {
    withDataDirLock(this.dir, () => {
      this.envoys.set(envoy.id, envoy);
      this.persistEnvoys();
    });
  }

  getProposal(id: string): PaymentProposal | undefined {
    return this.proposals.get(id);
  }

  listProposals(): PaymentProposal[] {
    return [...this.proposals.values()];
  }

  saveProposal(proposal: PaymentProposal): void {
    withDataDirLock(this.dir, () => {
      this.proposals.set(proposal.id, proposal);
      this.persistProposals();
    });
  }

  private async load(): Promise<void> {
    const envoys = await this.readJson<Envoy[]>(ENVOYS_FILE, []);
    for (const e of envoys) {
      this.envoys.set(e.id, e);
    }

    const proposals = await this.readJson<PaymentProposal[]>(PROPOSALS_FILE, []);
    for (const p of proposals) {
      this.proposals.set(p.id, {
        ...p,
        money: assertValidMoney(p.money),
      });
    }

    await this.loadAudit();
  }

  private async loadAudit(): Promise<void> {
    const filePath = path.join(this.dir, AUDIT_FILE);
    try {
      const raw = await fsPromises.readFile(filePath, "utf8");
      const lines = raw.split("\n").filter((line: string) => line.trim().length > 0);
      for (const line of lines) {
        const parsed = JSON.parse(line) as Partial<AuditEvent>;
        if (!parsed.id || !parsed.proposalId || !parsed.action || !parsed.actor) {
          throw new DomainError("corrupt audit.jsonl: missing required fields");
        }
        const event: AuditEvent = {
          id: parsed.id,
          scope: parsed.scope ?? "proposal",
          proposalId: parsed.proposalId,
          at: parsed.at ?? new Date().toISOString(),
          actor: parsed.actor,
          action: parsed.action,
          from: parsed.from ?? null,
          to: parsed.to ?? null,
          detail: parsed.detail,
        };
        this.innerAudit.append(event);
      }
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return;
      }
      throw err;
    }
  }

  private async readJson<T>(file: string, fallback: T): Promise<T> {
    try {
      const raw = await fsPromises.readFile(path.join(this.dir, file), "utf8");
      return JSON.parse(raw) as T;
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        return fallback;
      }
      throw err;
    }
  }

  private persistProposals(): void {
    const target = path.join(this.dir, PROPOSALS_FILE);
    writeFileAtomicFsync(target, JSON.stringify([...this.proposals.values()], null, 2));
  }

  private persistEnvoys(): void {
    const target = path.join(this.dir, ENVOYS_FILE);
    writeFileAtomicFsync(target, JSON.stringify([...this.envoys.values()], null, 2));
  }

  private appendAuditLine(event: AuditEvent): void {
    withDataDirLock(this.dir, () => {
      const filePath = path.join(this.dir, AUDIT_FILE);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "", "utf8");
      }
      appendLineFsync(filePath, `${JSON.stringify(event)}\n`);
    });
  }

  async ensureEnvoy(id: string, displayName: string): Promise<Envoy> {
    const existing = this.getEnvoy(id);
    if (existing) {
      return existing;
    }
    const envoy = createEnvoy(id, displayName);
    this.saveEnvoy(envoy);
    return envoy;
  }
}
