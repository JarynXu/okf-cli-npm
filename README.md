# OKF CLI — npm distribution

This repository publishes the native OKF CLI through npm.

```bash
npm install --global @open-knowledge-stack/okf
okf --help
```

The package does not reimplement the CLI in JavaScript. A small Node.js launcher selects the matching optional platform package and executes the Rust binary produced by `okf-cli`.

Seven packages share one version: the cross-platform launcher plus Linux, macOS, and Windows packages for x64 and arm64.

Development checks:

```bash
npm ci
npm run check
```

Set `OKF_BINARY_PATH` to test the launcher against a locally built CLI.
