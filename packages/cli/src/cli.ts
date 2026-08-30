#!/usr/bin/env node
import { openCliContext } from "./context.js";
import { runCommand } from "./commands.js";
import { defaultRailName, peekRailFromArgv } from "./rail.js";

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const railName = peekRailFromArgv(argv) ?? defaultRailName();
  const ctx = await openCliContext(undefined, railName);
  const result = await runCommand(ctx, argv);
  if (!result.ok) {
    console.error(`error: ${result.error}`);
    process.exit(1);
  }
  if (result.message) {
    console.log(result.message);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
