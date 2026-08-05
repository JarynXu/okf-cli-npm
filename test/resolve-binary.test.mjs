import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { packageForPlatform, resolveBinary, supportedPlatforms } from "../packages/okf/lib/resolve-binary.js";

test("platform mapping covers the six supported targets", () => {
  assert.equal(supportedPlatforms.length, 6);
  assert.equal(packageForPlatform("linux", "x64"), "@open-knowledge-stack/okf-linux-x64");
  assert.equal(packageForPlatform("win32", "arm64"), "@open-knowledge-stack/okf-win32-arm64");
});

test("unsupported platform fails", () => {
  assert.throws(() => packageForPlatform("freebsd", "x64"), /Unsupported platform/);
});

test("OKF_BINARY_PATH takes precedence", () => {
  assert.equal(resolveBinary({ environment: { OKF_BINARY_PATH: "local/okf" }, exists: () => true }), path.resolve("local/okf"));
});

test("resolver constructs the executable path", () => {
  const packageJson = path.join("/virtual", "node_modules", "@open-knowledge-stack", "okf-linux-x64", "package.json");
  const resolved = resolveBinary({ platform: "linux", arch: "x64", environment: {}, resolver: () => packageJson, exists: () => true });
  assert.equal(resolved, path.join(path.dirname(packageJson), "bin", "okf"));
});
