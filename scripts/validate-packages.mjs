#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { platforms } from "./platforms.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const main = readJson("packages/okf/package.json");
const failures = [];

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
}

if (main.name !== "@open-knowledge-stack/okf") failures.push("launcher package name mismatch");
if (main.bin?.okf !== "bin/okf.js") failures.push("launcher bin mapping mismatch");
if (main.scripts?.postinstall) failures.push("launcher must not define a postinstall script");

for (const platform of platforms) {
  const directory = `packages/okf-${platform.packageSuffix}`;
  const manifestFile = `${directory}/package.json`;
  if (!fs.existsSync(path.join(root, manifestFile))) {
    failures.push(`missing ${manifestFile}`);
    continue;
  }
  const manifest = readJson(manifestFile);
  if (manifest.name !== platform.packageName) failures.push(`${platform.packageName}: name mismatch`);
  if (manifest.version !== main.version) failures.push(`${platform.packageName}: version mismatch`);
  if (JSON.stringify(manifest.os) !== JSON.stringify([platform.os])) failures.push(`${platform.packageName}: os mismatch`);
  if (JSON.stringify(manifest.cpu) !== JSON.stringify([platform.cpu])) failures.push(`${platform.packageName}: cpu mismatch`);
  if (main.optionalDependencies?.[platform.packageName] !== main.version) failures.push(`${platform.packageName}: optional dependency mismatch`);
  if (!manifest.files?.includes(`bin/${platform.executable}`)) failures.push(`${platform.packageName}: binary file mapping mismatch`);
  for (const file of ["LICENSE", "NOTICE"]) {
    if (!fs.existsSync(path.join(root, directory, file))) failures.push(`${platform.packageName}: ${file} missing`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}
console.log(`validated npm package graph for version ${main.version}`);
