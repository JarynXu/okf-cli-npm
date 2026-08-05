export const platforms = Object.freeze([
  { packageSuffix: "linux-x64", packageName: "@open-knowledge-stack/okf-linux-x64", os: "linux", cpu: "x64", executable: "okf" },
  { packageSuffix: "linux-arm64", packageName: "@open-knowledge-stack/okf-linux-arm64", os: "linux", cpu: "arm64", executable: "okf" },
  { packageSuffix: "darwin-x64", packageName: "@open-knowledge-stack/okf-darwin-x64", os: "darwin", cpu: "x64", executable: "okf" },
  { packageSuffix: "darwin-arm64", packageName: "@open-knowledge-stack/okf-darwin-arm64", os: "darwin", cpu: "arm64", executable: "okf" },
  { packageSuffix: "win32-x64", packageName: "@open-knowledge-stack/okf-win32-x64", os: "win32", cpu: "x64", executable: "okf.exe" },
  { packageSuffix: "win32-arm64", packageName: "@open-knowledge-stack/okf-win32-arm64", os: "win32", cpu: "arm64", executable: "okf.exe" }
]);
