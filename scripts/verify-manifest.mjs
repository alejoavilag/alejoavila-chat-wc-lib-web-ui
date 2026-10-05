import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = join("dist", "chat");

const manifest = JSON.parse(await readFile(join(ROOT, "manifest.json"), "utf8"));
const { version } = JSON.parse(await readFile("package.json", "utf8"));

const problems = [];

if (manifest.version !== version) {
  problems.push(`manifest version ${manifest.version} does not match package ${version}`);
}

if (!manifest.entry.startsWith(`v${version}/`)) {
  problems.push(`entry ${manifest.entry} is not under the released version`);
}

const bundle = await readFile(join(ROOT, manifest.entry));
const digest = `sha384-${createHash("sha384").update(bundle).digest("base64")}`;

if (digest !== manifest.integrity) {
  problems.push(`integrity does not match the bundle: ${digest}`);
}

if (bundle.byteLength !== manifest.bytes) {
  problems.push(`bytes ${manifest.bytes} does not match the bundle ${bundle.byteLength}`);
}

if (problems.length) {
  for (const problem of problems) process.stderr.write(`::error::${problem}\n`);
  process.exit(1);
}

process.stdout.write(`manifest verified: ${manifest.entry} ${manifest.integrity}\n`);
