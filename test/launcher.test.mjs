import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const launcher = path.resolve("packages/okf/bin/okf.js");

test("launcher forwards arguments and exit status", { skip: process.platform === "win32" }, () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "okf-launcher-test-"));
  const fake = path.join(directory, "okf");
  fs.writeFileSync(fake, `#!/usr/bin/env node\nconsole.log(JSON.stringify(process.argv.slice(2)));\nprocess.exit(7);\n`, { mode: 0o755 });
  try {
    const result = spawnSync(process.execPath, [launcher, "validate", "a b"], {
      encoding: "utf8",
      env: { ...process.env, OKF_BINARY_PATH: fake }
    });
    assert.equal(result.status, 7);
    assert.equal(result.stdout.trim(), '["validate","a b"]');
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("launcher reports a missing override", () => {
  const result = spawnSync(process.execPath, [launcher], {
    encoding: "utf8",
    env: { ...process.env, OKF_BINARY_PATH: path.join(os.tmpdir(), "definitely-missing-okf") }
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /OKF_BINARY_PATH does not exist/);
});
