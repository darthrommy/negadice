// Copies tauri-action's built artifacts into ./release-artifacts/ with flat
// basenames, so they can be uploaded and later attached to a GitHub Release.
// The artifact paths come from tauri-action's `artifactPaths` output, passed in
// as a JSON array via the ARTIFACT_PATHS env var.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { basename, join } from "node:path";

const paths = JSON.parse(process.env.ARTIFACT_PATHS ?? "[]");
if (paths.length === 0) {
  console.error("No artifact paths provided (ARTIFACT_PATHS was empty)");
  process.exit(1);
}

const outDir = "release-artifacts";
mkdirSync(outDir, { recursive: true });
for (const p of paths) {
  // tauri-action also lists the raw .app bundle (a directory) — we only want the
  // distributable installer files (.dmg, .msi, .exe, .app.tar.gz, ...).
  if (statSync(p).isDirectory()) {
    console.log(`skipping directory ${basename(p)}`);
    continue;
  }
  const dest = join(outDir, basename(p));
  copyFileSync(p, dest);
  console.log(`staged ${dest}`);
}
