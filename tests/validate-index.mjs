import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

const required = [
  'id="screenshot-course"',
  'href="#screenshot-course"',
  "完整实操课：从打开 Codex 到交付结果",
  "步骤 01",
  "步骤 12",
  'id="china-access"',
  'href="#china-access"',
  "Codex 国内站使用教程",
  '<details class="nav-group" open>',
  '<summary>01 新手入门</summary>',
  '<summary>02 Codex 国内站</summary>',
  '<summary>03 Codex 指令保姆级教程</summary>',
  '<summary>04 Codex 项目实战</summary>',
  'href="#project-browser-control"',
  'href="#project-inquiry-site"',
  'href="#project-solo-wechat-mini"',
  'href="#project-personal-site"',
  'href="#project-product-video"',
  'href="#project-ppt"',
  'id="project-browser-control"',
  'id="project-inquiry-site"',
  'id="project-solo-wechat-mini"',
  'id="project-personal-site"',
  'id="project-product-video"',
  'id="project-ppt"',
  "操控浏览器",
  "询盘外贸独立站",
  "一人公司微信小程序",
  "个人网站",
  "产品宣传视频",
  "PPT",
  '<summary>05 模板与资料</summary>',
  'href="#china-start"',
  'href="#china-config"',
  'href="#china-first-task"',
  'href="#china-faq"',
  'id="china-start"',
  'id="china-config"',
  'id="china-first-task"',
  'id="china-faq"',
  'id="slash-commands"',
  'href="#slash-commands"',
  "Codex 指令保姆级教程",
  "普通 prompt = 让 Codex 干什么活",
  "/init",
  "/resume",
  "https://x.com/dengdry/status/2052026438442725525",
  'id="slash-overview"',
  'id="slash-command-set"',
  'id="slash-sidefork"',
  'id="slash-workflow"',
  'id="slash-practice"',
  'href="#slash-overview"',
  'href="#slash-command-set"',
  'href="#slash-sidefork"',
  'href="#slash-workflow"',
  'href="#slash-practice"',
  "本节大纲",
];

const missing = required.filter((text) => !html.includes(text));

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const hrefs = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
const brokenAnchors = hrefs.filter((href) => href !== "top" && !ids.includes(href));
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
const navGroupCount = [...html.matchAll(/<details class="nav-group"/g)].length;
const forbiddenLayout = [
  "right-toc",
  "progress-card",
  "toc-list",
  "product-courses",
  "product-board",
  "product-item",
  "全部产品",
].filter((text) => html.includes(text));
const publicScreenshotWording = [
  "截图",
  "截图里",
  "截图里的",
  "你补充的截图",
  "提取",
  "复盘材料",
].filter((text) => html.includes(text));

if (missing.length || brokenAnchors.length || duplicateIds.length || navGroupCount !== 5 || forbiddenLayout.length || publicScreenshotWording.length) {
  console.error("index.html validation failed");
  if (missing.length) console.error("Missing content:", missing.join(", "));
  if (brokenAnchors.length) console.error("Broken anchors:", brokenAnchors.join(", "));
  if (duplicateIds.length) console.error("Duplicate section ids:", duplicateIds.join(", "));
  if (navGroupCount !== 5) console.error("Expected 5 nav groups, found:", navGroupCount);
  if (forbiddenLayout.length) console.error("Forbidden right-side layout:", forbiddenLayout.join(", "));
  if (publicScreenshotWording.length) console.error("Forbidden screenshot-source wording:", publicScreenshotWording.join(", "));
  process.exit(1);
}

console.log(`index.html validation passed: ${ids.length} sections, ${hrefs.length} anchors`);
