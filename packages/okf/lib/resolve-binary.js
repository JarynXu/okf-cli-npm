import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const PLATFORM_PACKAGES = Object.freeze({
  "linux-x64": "@open-knowledge-stack/okf-linux-x64",
  "linux-arm64": "@open-knowledge-stack/okf-linux-arm64",
  "darwin-x64": "@open-knowledge-stack/okf-darwin-x64",
  "darwin-arm64": "@open-knowledge-stack/okf-darwin-arm64",
  "win32-x64": "@open-knowledge-stack/okf-win32-x64",
  "win32-arm64": "@open-knowledge-stack/okf-win32-arm64"
});

export function packageForPlatform(platform = process.platform, arch = process.arch) {
  const key = `${platform}-${arch}`;
  const packageName = PLATFORM_PACKAGES[key];
  if (!packageName) throw new Error(`Unsupported platform ${key}. Supported platforms: ${Object.keys(PLATFORM_PACKAGES).join(", ")}`);
  return packageName;
}

export function resolveBinary({
  platform = process.platform,
  arch = process.arch,
  environment = process.env,
  resolver = require.resolve,
  exists = fs.existsSync
} = {}) {
  if (environment.OKF_BINARY_PATH) {
    const override = path.resolve(environment.OKF_BINARY_PATH);
    if (!exists(override)) throw new Error(`OKF_BINARY_PATH does not exist: ${override}`);
    return override;
  }

  const packageName = packageForPlatform(platform, arch);
  let packageJson;
  try {
    packageJson = resolver(`${packageName}/package.json`);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`The native package ${packageName} is not installed. Reinstall @open-knowledge-stack/okf with optional dependencies enabled. Resolver detail: ${detail}`);
  }

  const executable = platform === "win32" ? "okf.exe" : "okf";
  const binary = path.join(path.dirname(packageJson), "bin", executable);
  if (!exists(binary)) throw new Error(`The native package ${packageName} is missing ${executable}`);
  return binary;
}

export const supportedPlatforms = Object.freeze(Object.keys(PLATFORM_PACKAGES));
