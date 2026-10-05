import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const ENTRY = "alejo-chat.js";

const { version } = JSON.parse(await readFile("package.json", "utf8"));

await rename(join(DIST, "main.js"), join(DIST, ENTRY));

const bundle = await readFile(join(DIST, ENTRY));
const integrity = `sha384-${createHash("sha384").update(bundle).digest("base64")}`;

const manifest = {
  name: "alejo-chat",
  version,
  entry: ENTRY,
  integrity,
  bytes: bundle.byteLength,
  framework: "Angular 22 Elements",
  changeDetection: "zoneless",
  encapsulation: "shadow-dom",
  builtAt: new Date().toISOString(),
};

await writeFile(join(DIST, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

process.stdout.write(`${ENTRY} ${bundle.byteLength} bytes\n${integrity}\n`);
