import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const workflow = await readFile(
  new URL("../.github/workflows/deploy-cloudflare-pages.yml", import.meta.url),
  "utf8",
);
const deploymentDoc = await readFile(new URL("../DEPLOYMENT.md", import.meta.url), "utf8");

const requiredPackageScripts = {
  build: "node scripts/build-site.mjs",
  test: "node tests/validate-index.mjs && node tests/validate-deployment.mjs && node tests/verify-premium-lock.mjs",
};

const missingScripts = Object.entries(requiredPackageScripts)
  .filter(([name, command]) => packageJson.scripts?.[name] !== command)
  .map(([name]) => name);

const requiredWorkflowText = [
  "npm run test",
  "npm run build",
  "pages deploy dist --project-name=aicodex --branch=main",
];

const missingWorkflowText = requiredWorkflowText.filter((text) => !workflow.includes(text));

const requiredDocText = [
  "Build command：`npm run build`",
  "Build output directory：`dist`",
  "以后只需要把修改推送到 GitHub 的 `main` 分支",
];

const missingDocText = requiredDocText.filter((text) => !deploymentDoc.includes(text));

if (missingScripts.length || missingWorkflowText.length || missingDocText.length) {
  console.error("deployment validation failed");
  if (missingScripts.length) console.error("Missing package scripts:", missingScripts.join(", "));
  if (missingWorkflowText.length) console.error("Missing workflow text:", missingWorkflowText.join(", "));
  if (missingDocText.length) console.error("Missing deployment doc text:", missingDocText.join(", "));
  process.exit(1);
}

console.log("deployment validation passed");
