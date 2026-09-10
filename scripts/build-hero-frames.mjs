// Turns the exploded-view render into the numbered JPEG sequence the hero
// scrubs through. Run it again if the source render changes:
//
//   node scripts/build-hero-frames.mjs
//
// Why a sequence rather than the video it came from: iOS refuses to decode a
// video it has not been told to play, so on a phone the element reported
// `seekable [0, 10]` and `buffered []` at the same time -- addressable but
// with no frames behind it -- and the hero sat on its poster forever. Measured
// on an iPhone in Instagram's in-app browser, which is where this link is
// actually opened. Images have no such policy, and at these settings the
// sequence is also half the weight of the video.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE = "assets/source/exploded-view-final.mp4";
const OUT_DIR = "public/images/hero-frames";

// 60 frames over a 10s source. One frame per ~28px of desktop scroll, which
// reads as continuous; 48 was visibly steppy on a slow drag, and 90 bought
// nothing but bytes.
const FRAME_COUNT = 60;
const SOURCE_SECONDS = 10;
const WIDTH = 960; // the stage renders ~660 CSS px at its widest
const QUALITY = 6; // ffmpeg -q:v, 2 best .. 31 worst

const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

execFileSync(
  ffmpeg,
  [
    "-v", "error",
    "-i", SOURCE,
    // scale height to -2 rather than -1 so it lands on an even number, which
    // the JPEG encoder requires for 4:2:0 chroma.
    "-vf", `fps=${FRAME_COUNT / SOURCE_SECONDS},scale=${WIDTH}:-2`,
    "-q:v", String(QUALITY),
    "-y", join(OUT_DIR, "f_%03d.jpg"),
  ],
  { stdio: "inherit" },
);

const files = readdirSync(OUT_DIR).filter((f) => f.endsWith(".jpg"));
const bytes = files.reduce((n, f) => n + statSync(join(OUT_DIR, f)).size, 0);

console.log(`${files.length} frames -> ${OUT_DIR}`);
console.log(`${(bytes / 1024 / 1024).toFixed(2)} MB total, ${Math.round(bytes / files.length / 1024)} KB average`);

if (files.length !== FRAME_COUNT) {
  console.error(`expected ${FRAME_COUNT} frames, got ${files.length}`);
  process.exit(1);
}
