import { spawn } from "node:child_process";

const port = process.env.ASSET_CHECK_PORT ?? "3099";
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", port], {
  cwd: process.cwd(),
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let logs = "";
server.stdout.on("data", (chunk) => { logs += chunk.toString(); });
server.stderr.on("data", (chunk) => { logs += chunk.toString(); });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let html = "";
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${base}/`);
      if (response.ok) {
        html = await response.text();
        break;
      }
    } catch {}
    await sleep(500);
  }

  if (!html) throw new Error(`Built server did not become ready.\n${logs}`);

  const assets = [...html.matchAll(/(?:href|src)="(\/[^"?#]+)"/g)]
    .map((match) => match[1])
    .filter((asset) => asset.startsWith("/_next/static/") && /\.(?:css|js)$/.test(asset));
  const uniqueAssets = [...new Set(assets)];
  if (uniqueAssets.length === 0) throw new Error("No static CSS or JS assets were referenced by /.");

  const failures = [];
  for (const asset of uniqueAssets) {
    const response = await fetch(`${base}${asset}`);
    const type = response.headers.get("content-type") ?? "";
    const expected = asset.endsWith(".css") ? "text/css" : "javascript";
    if (response.status !== 200 || !type.includes(expected)) {
      failures.push(`${asset}: HTTP ${response.status}, Content-Type ${type}`);
    }
  }

  console.log(`Verified ${uniqueAssets.length} referenced CSS/JS assets from /.`);
  if (failures.length) throw new Error(`Asset verification failed:\n${failures.join("\n")}`);
} finally {
  if (server.pid) {
    try { process.kill(-server.pid, "SIGTERM"); } catch {}
    await sleep(200);
    try { process.kill(-server.pid, "SIGKILL"); } catch {}
  }
}
