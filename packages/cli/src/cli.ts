#!/usr/bin/env node
import { openCliContext } from "./context.js";
import { runCommand } from "./commands.js";

async function main(): Promise<void> {
  const ctx = await openCliContext();
  const result = await runCommand(ctx, process.argv.slice(2));
  if (!result.ok) {
    console.error(`error: ${result.error}`);
    process.exit(1);
  }
  if (result.message) {
    console.log(result.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
