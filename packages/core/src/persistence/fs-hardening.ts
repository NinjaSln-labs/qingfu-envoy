import fs from "node:fs";
import path from "node:path";
import { DomainError } from "../domain/types.js";

const LOCK_FILE = ".store.lock";

/**
 * Exclusive lock for the data directory (V1 single-writer discipline).
 * Stale locks from dead processes are replaced when PID is not running.
 */
export function withDataDirLock<T>(dir: string, fn: () => T): T {
  const lockPath = path.join(dir, LOCK_FILE);
  tryAcquireOrReclaimLock(lockPath);
  try {
    return fn();
  } finally {
    try {
      fs.unlinkSync(lockPath);
    } catch {
      // lock already gone
    }
  }
}

function tryAcquireOrReclaimLock(lockPath: string): void {
  try {
    const fd = fs.openSync(lockPath, "wx");
    fs.writeFileSync(fd, `${process.pid}\n`, "utf8");
    fs.closeSync(fd);
    return;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") {
      throw err;
    }
  }

  if (isStaleLock(lockPath)) {
    fs.unlinkSync(lockPath);
    const fd = fs.openSync(lockPath, "wx");
    fs.writeFileSync(fd, `${process.pid}\n`, "utf8");
    fs.closeSync(fd);
    return;
  }

  throw new DomainError(
    "data store is locked by another process; retry later",
  );
}

function isStaleLock(lockPath: string): boolean {
  try {
    const raw = fs.readFileSync(lockPath, "utf8").trim();
    const pid = Number(raw);
    if (!Number.isInteger(pid) || pid <= 0) {
      return true;
    }
    process.kill(pid, 0);
    return false;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ESRCH") {
      return true;
    }
    if (code === "ENOENT") {
      return true;
    }
    return false;
  }
}

export function writeFileAtomicFsync(
  targetPath: string,
  body: string,
): void {
  const tmp = `${targetPath}.${process.pid}.tmp`;
  const fd = fs.openSync(tmp, "w");
  try {
    fs.writeFileSync(fd, body, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmp, targetPath);
  const outFd = fs.openSync(targetPath, "r");
  try {
    fs.fsyncSync(outFd);
  } finally {
    fs.closeSync(outFd);
  }
}

export function appendLineFsync(filePath: string, line: string): void {
  const fd = fs.openSync(filePath, "a");
  try {
    fs.writeFileSync(fd, line, "utf8");
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
}
