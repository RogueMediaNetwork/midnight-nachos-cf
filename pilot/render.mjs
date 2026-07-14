// Renders pilot.html to a 1080x1920 H.264 MP4 (silent) via headless Chromium + ffmpeg.
// Usage:
//   node render.mjs --stills <outdir>     one PNG per shot midpoint (QA pass)
//   node render.mjs --video <out.mp4>     full 24fps render
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const FPS = 24;
const mode = process.argv[2] || "--stills";
const out = process.argv[3] || (mode === "--video" ? "pilot.mp4" : "stills");

const CHROMIUM = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const FFMPEG =
  process.env.FFMPEG_BIN ||
  resolve(here, "node_modules/@ffmpeg-installer/linux-x64/ffmpeg");

const browser = await chromium.launch({
  executablePath: CHROMIUM,
  headless: true,
  args: ["--no-sandbox", "--force-color-profile=srgb", "--hide-scrollbars"],
});
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
});
await page.goto("file://" + resolve(here, "pilot.html"));
await page.waitForFunction(() => window.READY === true, null, { timeout: 15000 });
const total = await page.evaluate(() => window.TOTAL_DURATION);
console.log(`timeline: ${total.toFixed(2)}s @ ${FPS}fps`);

async function frame(t, type = "png") {
  await page.evaluate((tt) => window.SEEK(tt), t);
  return page.screenshot({ type, ...(type === "jpeg" ? { quality: 95 } : {}) });
}

if (mode === "--stills") {
  mkdirSync(out, { recursive: true });
  const shots = await page.evaluate(() =>
    // t0/d live in closure; reconstruct via SEEK probing is overkill — expose midpoints:
    (() => {
      const mids = [];
      let seen = -1;
      for (let t = 0.05; t < window.TOTAL_DURATION; t += 0.05) {
        const idx = window.SEEK(t);
        if (idx !== seen) { mids.push({ idx, start: t }); seen = idx; }
      }
      return mids;
    })()
  );
  for (let i = 0; i < shots.length; i++) {
    const next = shots[i + 1] ? shots[i + 1].start : total;
    const mid = (shots[i].start + next) / 2;
    const buf = await frame(mid);
    const f = `${out}/shot${String(i + 1).padStart(2, "0")}_t${mid.toFixed(1)}.png`;
    writeFileSync(f, buf);
    console.log("wrote", f);
  }
} else {
  const nFrames = Math.round(total * FPS);
  const ff = spawn(
    FFMPEG,
    [
      "-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
      "-c:v", "libx264", "-preset", "medium", "-crf", "18",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
    ],
    { stdio: ["pipe", "inherit", "inherit"] }
  );
  const done = new Promise((res, rej) => {
    ff.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exit " + c))));
  });
  const t0 = Date.now();
  for (let i = 0; i < nFrames; i++) {
    const buf = await frame(i / FPS, "jpeg");
    if (!ff.stdin.write(buf)) {
      await new Promise((r) => ff.stdin.once("drain", r));
    }
    if (i % 96 === 0) {
      const rate = (i + 1) / ((Date.now() - t0) / 1000);
      console.log(
        `frame ${i}/${nFrames} (${((i / nFrames) * 100).toFixed(0)}%, ${rate.toFixed(1)} fps)`
      );
    }
  }
  ff.stdin.end();
  await done;
  console.log("encoded", out, "in", ((Date.now() - t0) / 1000).toFixed(0) + "s");
}
await browser.close();
