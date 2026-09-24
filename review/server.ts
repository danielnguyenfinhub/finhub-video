// Local server for the review page: serves the page and public/ (with HTTP
// Range, so the Player's <video> can seek), saves edit.json and starts renders.
// Bound to 127.0.0.1 only. Bundled by review/build.mjs into dist/server.cjs.
import { spawn, type ChildProcess } from "node:child_process";
import {
  copyFileSync,
  createReadStream,
  existsSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { extname, join, resolve } from "node:path";
import { z } from "zod";
import { editSchema } from "../src/mortgage/schema";

const ROOT = resolve(__dirname, "..", "..");
const DIST = join(ROOT, "review", "dist");
const PUBLIC = join(ROOT, "public");
const VIDEOS = join(PUBLIC, "videos");
const PORT = 4100;
const MAX_BODY = 1_000_000;
const SLUG = /^[a-z0-9][a-z0-9-]*$/;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".map": "application/json",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
};

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

// Serves a file inside `base`, answering Range requests.
const serveFile = (req: IncomingMessage, res: ServerResponse, base: string, rel: string) => {
  const file = resolve(base, `.${rel}`);
  if (!file.startsWith(base) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  const size = statSync(file).size;
  const headers = {
    "Content-Type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
    "Accept-Ranges": "bytes",
  };
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
  if (!range) {
    res.writeHead(200, { ...headers, "Content-Length": size });
    createReadStream(file).pipe(res);
    return;
  }
  const start = range[1] === "" ? size - Number(range[2]) : Number(range[1]);
  const end = range[1] !== "" && range[2] !== "" ? Math.min(Number(range[2]), size - 1) : size - 1;
  res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
  createReadStream(file, { start, end }).pipe(res);
};

const readBody = (req: IncomingMessage) =>
  new Promise<string>((ok, fail) => {
    let body = "";
    req.on("data", (c: Buffer) => {
      body += c;
      if (body.length > MAX_BODY) fail(new Error("edit.json is larger than 1 MB"));
    });
    req.on("end", () => ok(body));
    req.on("error", fail);
  });

// A video is reviewable once prep-video.py has made all three files.
const listVideos = () =>
  readdirSync(VIDEOS).filter(
    (d) =>
      SLUG.test(d) &&
      ["source.mp4", "words.json", "edit.json"].every((f) => existsSync(join(VIDEOS, d, f))),
  );

// Validates with the same schema the render uses, keeps the previous version
// as edit.json.bak, then writes.
const saveEdit = async (req: IncomingMessage, res: ServerResponse, slug: string) => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readBody(req));
  } catch (e) {
    return json(res, 400, { error: `Not saved: ${(e as Error).message}` });
  }
  const r = editSchema.safeParse(parsed);
  if (!r.success)
    return json(res, 400, { error: `Not saved, edit.json would be invalid:\n${z.prettifyError(r.error)}` });
  const file = join(VIDEOS, slug, "edit.json");
  copyFileSync(file, `${file}.bak`);
  writeFileSync(file, `${JSON.stringify(parsed, null, 2)}\n`);
  json(res, 200, { saved: `public/videos/${slug}/edit.json`, backup: `public/videos/${slug}/edit.json.bak` });
};

// One render at a time, through the same script Daniel would run.
let render: { slug: string; proc: ChildProcess; lines: string[]; exitCode: number | null } | null = null;
const startRender = (res: ServerResponse, slug: string) => {
  if (render && render.exitCode === null)
    return json(res, 409, { error: `Already rendering ${render.slug}; wait for it to finish.` });
  const proc = spawn("python", [join("scripts", "render-video.py"), slug], { cwd: ROOT });
  const job = { slug, proc, lines: [] as string[], exitCode: null as number | null };
  const keep = (b: Buffer) => {
    job.lines.push(...b.toString().split(/\r?\n/).filter(Boolean));
    job.lines.splice(0, Math.max(0, job.lines.length - 30));
  };
  proc.stdout?.on("data", keep);
  proc.stderr?.on("data", keep);
  proc.on("error", (e) => {
    job.lines.push(`Could not start the render: ${e.message}`);
    job.exitCode = -1;
  });
  proc.on("close", (code) => {
    job.exitCode = code ?? -1;
  });
  render = job;
  json(res, 202, { started: slug });
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const path = decodeURIComponent(url.pathname);
    const api = /^\/api\/(edit|render)\/([^/]+)$/.exec(path);
    if (path === "/api/videos") return json(res, 200, listVideos());
    if (api) {
      const [, what, slug] = api;
      if (!SLUG.test(slug) || !listVideos().includes(slug))
        return json(res, 404, { error: `No reviewable video "${slug}" in public/videos/.` });
      if (what === "edit" && req.method === "POST") return await saveEdit(req, res, slug);
      if (what === "render" && req.method === "POST") return startRender(res, slug);
      if (what === "render")
        return json(res, 200, render?.slug === slug
          ? { running: render.exitCode === null, exitCode: render.exitCode, lines: render.lines }
          : { running: false, exitCode: null, lines: [] });
      return json(res, 405, { error: "Method not allowed" });
    }
    if (path.startsWith("/public/")) return serveFile(req, res, PUBLIC, path.slice("/public".length));
    return serveFile(req, res, DIST, path === "/" ? "/index.html" : path);
  } catch (e) {
    json(res, 500, { error: (e as Error).message });
  }
});
server.on("error", (e: NodeJS.ErrnoException) => {
  console.error(
    e.code === "EADDRINUSE"
      ? `The review page is already running: open http://localhost:${PORT}/ (or close the other window running it first).`
      : `The review page could not start: ${e.message}`,
  );
  process.exit(1);
});
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Review page: http://localhost:${PORT}/  (Ctrl+C to stop)`);
});
