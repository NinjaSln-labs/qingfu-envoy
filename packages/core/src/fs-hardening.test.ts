import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { appendLineFsync, writeFileAtomicFsync } from "./persistence/fs-hardening.js";

describe("fs-hardening", () => {
  it("writeFileAtomicFsync calls fsync on data", () => {
    const dir = fs.mkdtempSync(path.join(fs.realpathSync("/tmp"), "qingfu-fs-"));
    const target = path.join(dir, "data.json");
    const fsyncSpy = vi.spyOn(fs, "fsyncSync");

    writeFileAtomicFsync(target, '{"ok":true}');

    expect(fs.readFileSync(target, "utf8")).toBe('{"ok":true}');
    expect(fsyncSpy).toHaveBeenCalled();
    fsyncSpy.mockRestore();
    fs.rmSync(dir, { recursive: true });
  });

  it("appendLineFsync calls fsync after append", () => {
    const dir = fs.mkdtempSync(path.join(fs.realpathSync("/tmp"), "qingfu-fs-"));
    const target = path.join(dir, "audit.jsonl");
    const fsyncSpy = vi.spyOn(fs, "fsyncSync");

    appendLineFsync(target, '{"a":1}\n');

    expect(fs.readFileSync(target, "utf8")).toBe('{"a":1}\n');
    expect(fsyncSpy).toHaveBeenCalled();
    fsyncSpy.mockRestore();
    fs.rmSync(dir, { recursive: true });
  });
});
