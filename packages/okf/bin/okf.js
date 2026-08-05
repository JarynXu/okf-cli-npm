#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { resolveBinary } from "../lib/resolve-binary.js";

let binary;
try {
  binary = resolveBinary();
} catch (error) {
  console.error(`okf: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const result = spawnSync(binary, process.argv.slice(2), {
  stdio: "inherit",
  windowsHide: true
});

if (result.error) {
  console.error(`okf: failed to start native binary: ${result.error.message}`);
  process.exit(1);
}
if (result.signal) process.kill(process.pid, result.signal);
process.exit(result.status ?? 1);
