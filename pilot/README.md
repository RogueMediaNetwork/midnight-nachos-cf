# EP1 pilot — "I Replaced Myself With AI Employees"

Paper-cutout style animated Short (9:16, 1080x1920, ~50s, silent — music/SFX added in post).
16 shots following the episode storyboard for That Mike Hamilton vs. The Future.

- `pilot.html` — the whole episode as a deterministic SVG/JS animation.
  `window.SEEK(t)` renders the frame at time `t`; `window.TOTAL_DURATION` is the length.
  Open in a browser and call `SEEK(12.5)` in the console to scrub.
- `render.mjs` — renders via headless Chromium + ffmpeg.
  - `node render.mjs --stills out/` → one QA still per shot
  - `node render.mjs --video ep1.mp4` → full 24fps H.264 render
  Needs `playwright-core` and `@ffmpeg-installer/ffmpeg` (`npm i playwright-core @ffmpeg-installer/ffmpeg`),
  plus a Chromium binary (path via `PW_CHROMIUM`, defaults to `/opt/pw-browsers/chromium`).

Editing tips: each shot is a `shot(duration, builder)` block in pilot.html; captions,
timing, and camera moves are all in the shot's `update(t, p)` function.
