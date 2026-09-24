// Builds the review page (review/main.tsx) and its local server
// (review/server.ts) into review/dist/ with the esbuild already in
// node_modules, then starts the server.
//
//   npm run review        build and open http://localhost:4100/
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const outdir = join(here, "dist");
mkdirSync(outdir, { recursive: true });
copyFileSync(join(here, "index.html"), join(outdir, "index.html"));
copyFileSync(join(here, "matte.html"), join(outdir, "matte.html"));

await esbuild.build({
  entryPoints: [join(here, "main.tsx")],
  outfile: join(outdir, "main.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  sourcemap: true,
  logLevel: "warning",
});
// Background removal page (matte.html): an ES module, since
// @remotion/video-matting uses import.meta.
await esbuild.build({
  entryPoints: [join(here, "matte.ts")],
  outfile: join(outdir, "matte.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  minify: true,
  logLevel: "warning",
});
await esbuild.build({
  entryPoints: [join(here, "server.ts")],
  outfile: join(outdir, "server.cjs"),
  bundle: true,
  format: "cjs",
  platform: "node",
  logLevel: "warning",
});

if (!process.argv.includes("--build-only"))
  await import(pathToFileURL(join(outdir, "server.cjs")).href);
