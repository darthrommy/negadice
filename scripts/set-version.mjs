// Writes a version string into every file that tracks it, preserving formatting.
// Usage: node scripts/set-version.mjs 2026.6.0
import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Invalid version: ${JSON.stringify(version)} (expected N.N.N)`);
  process.exit(1);
}

const edits = [
  // Cargo.toml: the package version is the only top-level `version = "..."`.
  {
    file: "src-tauri/Cargo.toml",
    re: /^version = "[^"]*"/m,
    to: `version = "${version}"`,
  },
  // Cargo.lock: the version line directly under the negadice package entry.
  {
    file: "src-tauri/Cargo.lock",
    re: /(name = "negadice"\r?\nversion = ")[^"]*(")/, // \r? tolerates CRLF on Windows runners
    to: `$1${version}$2`,
  },
  // package.json: the first "version" field (top-level package metadata).
  {
    file: "package.json",
    re: /("version":\s*")[^"]*(")/,
    to: `$1${version}$2`,
  },
];

for (const { file, re, to } of edits) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(re, to);
  if (before === after) {
    console.error(`Failed to update version in ${file} (pattern not found)`);
    process.exit(1);
  }
  writeFileSync(file, after);
  console.log(`Updated ${file} -> ${version}`);
}
