import { spawn } from "node:child_process";
import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const tempDir = join(tmpdir(), `codex-guide-lock-${Date.now()}`);
const reportPath = join(tempDir, "report.json");
const runnerPath = join("dist", "__premium-lock-runner.html");

await mkdir(tempDir, { recursive: true });
await copyFile("index.html", join("dist", "index.html"));
await writeFile(
  runnerPath,
  `<!doctype html>
<html>
  <body>
    <script>
      const report = async (payload) => {
        document.title = "REPORT:" + JSON.stringify(payload);
      };
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      localStorage.removeItem("codexGuidePremiumUnlocked");
      const frame = document.createElement("iframe");
      frame.src = "${origin}/?lock-test=" + Date.now();
      document.body.appendChild(frame);
      frame.addEventListener("load", async () => {
        const view = frame.contentWindow;
        await wait(250);
        const doc = frame.contentDocument;
        const locked = {
          unlocked: doc.body.classList.contains("premium-unlocked"),
          premiumDisplay: view.getComputedStyle(doc.querySelector("#china-access")).display,
          lockedGroups: doc.querySelectorAll("[data-premium-group='true'][aria-disabled='true']").length,
        };
        doc.querySelector("#unlock-password").value = "codex2026";
        doc.querySelector("#unlock-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        await wait(500);
        const unlockedView = frame.contentWindow;
        const unlocked = {
          unlocked: doc.body.classList.contains("premium-unlocked"),
          premiumDisplay: unlockedView.getComputedStyle(doc.querySelector("#china-access")).display,
          storage: unlockedView.localStorage.getItem("codexGuidePremiumUnlocked"),
          unlockedGroups: doc.querySelectorAll("[data-premium-group='true'][aria-disabled='false']").length,
        };
        await report({ locked, unlocked });
      }, { once: true });
    </script>
  </body>
</html>
`,
  "utf8",
);

const server = spawn("python", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", "dist"], {
  stdio: "ignore",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await sleep(1500);
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--dump-dom",
      "--virtual-time-budget=5000",
      `--user-data-dir=${join(tempDir, "chrome-profile")}`,
      `${origin}/__premium-lock-runner.html`,
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  let stdout = "";
  let stderr = "";
  chrome.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  chrome.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const exitCode = await new Promise((resolve) => chrome.on("close", resolve));
  if (exitCode !== 0) {
    throw new Error(`Chrome exited with ${exitCode}: ${stderr}`);
  }

  const match = stdout.match(/<title>REPORT:(.*?)<\/title>/);
  if (!match) {
    await writeFile(reportPath, stdout, "utf8");
    throw new Error(`Browser report was not produced. DOM saved to ${reportPath}`);
  }

  const result = JSON.parse(match[1].replaceAll("&quot;", '"'));
  if (
    result.locked.unlocked ||
    result.locked.premiumDisplay !== "none" ||
    result.locked.lockedGroups !== 6 ||
    !result.unlocked.unlocked ||
    result.unlocked.premiumDisplay === "none" ||
    result.unlocked.storage !== "true" ||
    result.unlocked.unlockedGroups !== 6
  ) {
    throw new Error(`Unexpected premium lock result: ${JSON.stringify(result)}`);
  }

  console.log("premium lock browser verification passed");
} finally {
  server.kill();
  await rm(runnerPath, { force: true });
}
