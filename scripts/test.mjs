import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const out = mkdtempSync(join(tmpdir(), "alejo-chat-tests-"));
const bundle = join(out, "tests.mjs");

const build = spawnSync(
  "npx",
  [
    "esbuild",
    "src/tests.ts",
    "--bundle",
    "--platform=node",
    "--format=esm",
    "--tsconfig=tsconfig.spec.json",
    "--log-level=error",
    `--outfile=${bundle}`,
  ],
  { stdio: "inherit" },
);

if (build.status !== 0) {
  rmSync(out, { recursive: true, force: true });
  process.exit(build.status ?? 1);
}

const run = spawnSync("node", ["--test", bundle], { stdio: "inherit" });
rmSync(out, { recursive: true, force: true });
process.exit(run.status ?? 1);
