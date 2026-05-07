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
  '<details class="nav-group" open>',
  '<summary>01 新手入门</summary>',
  '<summary>02 Codex 国内站</summary>',
  '<summary>03 核心工作法</summary>',
  '<summary>04 进阶配置</summary>',
  '<summary>05 模板与资料</summary>',
  'href="#china-start"',
  'href="#china-config"',
  'href="#china-first-task"',
  'href="#china-faq"',
  'id="china-start"',
  'id="china-config"',
  'id="china-first-task"',
  'id="china-faq"',
];

const missing = required.filter((text) => !html.includes(text));

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const brokenAnchors = hrefs.filter((href) => href !== "top" && !ids.includes(href));
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const navGroupCount = [...html.matchAll(/<details class="nav-group"/g)].length;
const chinaSection = html.match(/<section id="china-access">[\s\S]*?<section id="prompting">/)?.[0] ?? "";
const forbiddenChinaContent = [
  "截图",
  "截图里",
  "截图里的",
  "你补充的截图",
  "提取",
  "复盘材料",
].filter((text) => chinaSection.includes(text));

if (missing.length || brokenAnchors.length || duplicateIds.length || navGroupCount !== 5 || forbiddenChinaContent.length) {
  console.error("index.html validation failed");
  if (missing.length) console.error("Missing content:", missing.join(", "));
  if (brokenAnchors.length) console.error("Broken anchors:", brokenAnchors.join(", "));
  if (duplicateIds.length) console.error("Duplicate section ids:", duplicateIds.join(", "));
  if (navGroupCount !== 5) console.error("Expected 5 nav groups, found:", navGroupCount);
  if (forbiddenChinaContent.length) console.error("Forbidden domestic tutorial wording:", forbiddenChinaContent.join(", "));
  process.exit(1);
}

console.log(`index.html validation passed: ${ids.length} sections, ${hrefs.length} anchors`);
