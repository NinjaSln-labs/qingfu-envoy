#!/usr/bin/env node
import http from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { handleApi } from "./api.js";
import { openWebContext, webHost, webPort } from "./context.js";
import { assertLocalhostHost } from "./host-policy.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadIndexHtml(): string {
  const path = join(__dirname, "..", "public", "index.html");
  return readFileSync(path, "utf8");
}

export async function createWebServer(ctx: Awaited<ReturnType<typeof openWebContext>>) {
  const indexHtml = loadIndexHtml();

  return http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "local"}`);

    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(indexHtml);
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      let body: unknown;
      if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        const raw = Buffer.concat(chunks).toString("utf8");
        body = raw ? JSON.parse(raw) : {};
      }

      const result = await handleApi(ctx, {
        method: req.method ?? "GET",
        path: url.pathname + url.search,
        body,
      });
      res.writeHead(result.status, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.body));
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  });
}

async function main(): Promise<void> {
  const host = webHost();
  assertLocalhostHost(host);
  const port = webPort();
  const ctx = await openWebContext();
  const server = await createWebServer(ctx);

  await new Promise<void>((resolve, reject) => {
    server.listen(port, host, () => resolve());
    server.on("error", reject);
  });

  console.log(`qingfu-web listening on http://${host}:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
