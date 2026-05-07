import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

const required = [
  'id="screenshot-course"',
  'href="#screenshot-course"',
  "截图课程：从打开 Codex 到交付结果",
  "截图 01",
  "截图 12",
  'id="china-access"',
  'href="#china-access"',
  "Codex 国内站使用教程",
];

const missing = required.filter((text) => !html.includes(text));

const ids = [...html.matchAll(/<section id="([^"]+)"/g)].map((match) => match[1]);
const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const brokenAnchors = hrefs.filter((href) => href !== "top" && !ids.includes(href));
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

if (missing.length || brokenAnchors.length || duplicateIds.length) {
  console.error("index.html validation failed");
  if (missing.length) console.error("Missing content:", missing.join(", "));
  if (brokenAnchors.length) console.error("Broken anchors:", brokenAnchors.join(", "));
  if (duplicateIds.length) console.error("Duplicate section ids:", duplicateIds.join(", "));
  process.exit(1);
}

console.log(`index.html validation passed: ${ids.length} sections, ${hrefs.length} anchors`);
