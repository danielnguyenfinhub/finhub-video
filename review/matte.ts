// Background removal for edit.json "background": "brand". Open
// http://localhost:4100/matte.html?slug=<slug>: it cuts Daniel out of
// public/videos/<slug>/source.mp4 with @remotion/video-matting (the modnet
// person model, 25.9 MB, downloaded from remotion.media once, then cached) and
// sends the result to the review server, which saves it as foreground.webm
// only if its frame count matches source.mp4. Runs in the browser on the GPU:
// roughly 13x the video's length, so keep the window open until it says Saved.
import {
  canUseVideoMatting,
  separateVideoLayers,
} from "@remotion/video-matting";

const slug = new URLSearchParams(location.search).get("slug") ?? "";
const $ = (id: string) => document.getElementById(id)!;
const status = (text: string, tone: "info" | "ok" | "bad" = "info") => {
  $("status").textContent = text;
  $("status").className = `status ${tone}`;
  document.title = `Background · ${text}`;
};
const run = $("run") as HTMLButtonElement;

const check = async () => {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug))
    return status(
      "Open this page from the review page, or add ?slug=<video> to the address.",
      "bad",
    );
  $("slug").textContent = slug;
  const can = await canUseVideoMatting({ model: "modnet" });
  if (!can.supported)
    return status(
      `This browser can't run background removal (${can.reason}). Use the Claude app's browser or Chrome.`,
      "bad",
    );
  run.disabled = false;
  status("Ready.");
};

run.addEventListener("click", async () => {
  run.disabled = true;
  const started = performance.now();
  try {
    const result = await separateVideoLayers({
      src: `/public/videos/${slug}/source.mp4`,
      model: "modnet",
      audio: "none",
      onModelLoadProgress: (p) => {
        if (p.progress !== null && p.progress < 1)
          status(`Loading the model… ${Math.round(p.progress * 100)}%`);
      },
      onProgress: (p) => {
        if (p.stage === "finalizing") return status("Finishing the file…");
        const elapsed = (performance.now() - started) / 1000;
        const left = p.progress ? elapsed / p.progress - elapsed : 0;
        status(
          `Removing the background… ${Math.round((p.progress ?? 0) * 100)}% ` +
            `(${p.processedDurationInSeconds.toFixed(0)} of ${p.durationInSeconds.toFixed(0)} s of video, ` +
            `about ${Math.ceil(left / 60)} min left)`,
        );
        ($("bar") as HTMLProgressElement).value = p.progress ?? 0;
      },
    });
    status("Saving foreground.webm…");
    const blob = await result.foreground.getBlob();
    await Promise.all([result.base.dispose(), result.foreground.dispose()]);
    const res = await fetch(`/api/foreground/${slug}`, {
      method: "POST",
      body: blob,
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error);
    const minutes = ((performance.now() - started) / 60000).toFixed(1);
    status(
      `Saved ${body.saved} (${body.frames} frames, ${minutes} min). Set "background": "brand" in edit.json to use it.`,
      "ok",
    );
  } catch (e) {
    status(`Stopped: ${(e as Error).message}`, "bad");
    run.disabled = false;
  }
});

check().catch((e) => status(`Stopped: ${(e as Error).message}`, "bad"));
