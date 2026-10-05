import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const WIDGET = "chat";
const BUNDLE = "alejo-chat.js";

const { version } = JSON.parse(await readFile("package.json", "utf8"));

const release = join(DIST, WIDGET, `v${version}`);
await mkdir(release, { recursive: true });
await rename(join(DIST, "main.js"), join(release, BUNDLE));

const bundle = await readFile(join(release, BUNDLE));
const integrity = `sha384-${createHash("sha384").update(bundle).digest("base64")}`;

const manifest = {
  name: "alejo-chat",
  version,
  entry: `v${version}/${BUNDLE}`,
  integrity,
  bytes: bundle.byteLength,
  element: "alejo-chat",
  framework: "Angular 22 Elements",
  changeDetection: "zoneless",
  encapsulation: "shadow-dom",
  builtAt: new Date().toISOString(),
};

const body = `${JSON.stringify(manifest, null, 2)}\n`;
await writeFile(join(DIST, WIDGET, "manifest.json"), body);
await writeFile(join(release, "manifest.json"), body);

process.stdout.write(`${WIDGET}/${manifest.entry} ${bundle.byteLength} bytes\n${integrity}\n`);
