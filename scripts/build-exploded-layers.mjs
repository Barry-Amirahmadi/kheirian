/**
 * Slices the flat exploded-view render into five layer bands.
 *
 * The source is a single JPEG, so the layers cannot be separated into真 cutouts —
 * the lid physically occludes the kraft sheet beneath it. Instead each layer is a
 * full-frame copy of the image clipped to a polygon that follows that layer's own
 * silhouette. Because the clips tile the frame exactly, the layers reassemble into
 * the untouched original when every offset is zero.
 *
 * Cut coordinates were traced against the 3042x1408 source and verified by
 * overlaying them on the render.
 *
 * Run: node scripts/build-exploded-layers.mjs
 */
import sharp from "sharp";
import { writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/images/products/exploded-view-hq.jpg");
const IMG_OUT = path.join(ROOT, "public/images/products/exploded-stack.jpg");
const TS_OUT = path.join(ROOT, "src/lib/exploded-layers.ts");

// Centre stack only — the source's baked-in Persian copy, leader lines and
// feature icons are cropped away and rebuilt as live HTML.
const CROP = { x: 1000, y: 40, w: 1270, h: 1330 };

// Silhouette boundaries between adjacent layers, in source-image pixels.
const CUTS = [
  [[900, 345], [1050, 353], [1442, 502], [2232, 217], [2400, 235]], // lid    | kraft 1
  [[900, 470], [1058, 468], [1468, 535], [2223, 435], [2400, 450]], // kraft1 | kraft 2
  [[900, 645], [1095, 640], [1510, 768], [2223, 620], [2400, 635]], // kraft2 | tray
  [[900, 862], [1080, 858], [1520, 1015], [2232, 863], [2400, 878]], // tray  | base
];

/**
 * The source render carries thin grey leader lines running from the annotation
 * labels toward the stack. Cropping cannot remove them — the longest reaches
 * well inside the stack's own bounding box — so they are painted out instead.
 *
 * Each line is a hairline that touches the right edge and sits on the flat cream
 * background. For every such band the pixels are replaced by a vertical blend of
 * the rows just above and below, but only where the original is markedly darker
 * than that blend. Anywhere the band crosses actual artwork the blend matches
 * what is already there, the test fails, and the pixels are left untouched.
 */
function removeLeaderLines(data, w, h, ch) {
  const lumAt = (x, y) => {
    const i = (y * w + x) * ch;
    return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  };

  const flagged = [];
  for (let y = 0; y < h; y++) if (lumAt(w - 1, y) < 215) flagged.push(y);

  const bands = [];
  let start = null;
  let prev = null;
  for (const y of flagged) {
    if (start === null) start = y;
    else if (y !== prev + 1) {
      bands.push([start, prev]);
      start = y;
    }
    prev = y;
  }
  if (start !== null) bands.push([start, prev]);

  const kept = [];
  let repainted = 0;

  for (const [y0, y1] of bands) {
    if (y1 - y0 > 8) continue; // thicker than a hairline — that is real content
    const a = y0 - 3;
    const b = y1 + 3;
    if (a < 0 || b >= h) continue;

    for (let x = 0; x < w; x++) {
      for (let y = y0; y <= y1; y++) {
        const t = (y - a) / (b - a);
        const ia = (a * w + x) * ch;
        const ib = (b * w + x) * ch;
        const i = (y * w + x) * ch;
        const r = data[ia] + (data[ib] - data[ia]) * t;
        const g = data[ia + 1] + (data[ib + 1] - data[ia + 1]) * t;
        const bl = data[ia + 2] + (data[ib + 2] - data[ia + 2]) * t;
        const cur = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const est = 0.299 * r + 0.587 * g + 0.114 * bl;
        if (est - cur > 8) {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = bl;
          repainted++;
        }
      }
    }
    kept.push(`${y0}-${y1}`);
  }

  return { bands: kept, repainted };
}

const yAt = (cut, x) => {
  for (let i = 0; i < cut.length - 1; i++) {
    const [x1, y1] = cut[i];
    const [x2, y2] = cut[i + 1];
    if (x >= x1 && x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
  }
  return x < cut[0][0] ? cut[0][1] : cut.at(-1)[1];
};

const px = (x, y) => [
  +(((x - CROP.x) / CROP.w) * 100).toFixed(3),
  +(((y - CROP.y) / CROP.h) * 100).toFixed(3),
];

const clipCut = (cut) => {
  const x0 = CROP.x;
  const x1 = CROP.x + CROP.w;
  const pts = [px(x0, yAt(cut, x0))];
  for (const [x, y] of cut) if (x > x0 && x < x1) pts.push(px(x, y));
  pts.push(px(x1, yAt(cut, x1)));
  return pts;
};

const toPolygon = (pts) =>
  `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;

const bands = CUTS.map(clipCut);

const polygons = [
  // Lid: top of frame down to cut A.
  toPolygon([[0, 0], [100, 0], ...[...bands[0]].reverse()]),
  // Middle three: between consecutive cuts.
  toPolygon([...bands[0], ...[...bands[1]].reverse()]),
  toPolygon([...bands[1], ...[...bands[2]].reverse()]),
  toPolygon([...bands[2], ...[...bands[3]].reverse()]),
  // Base: cut D down to the bottom of the frame.
  toPolygon([...bands[3], [100, 100], [0, 100]]),
];

const LAYERS = [
  { id: "lid", title: "لایه چاپی بیرونی", note: "با کیفیت افست", offset: 30.1, z: 50, labelAt: 19.5 },
  { id: "board-top", title: "لایه مقوا", note: "سخت و محکم", offset: 21.1, z: 40, labelAt: 33.8 },
  { id: "flute", title: "لایه فلوت", note: "جذب ضربه", offset: 12.4, z: 30, labelAt: 49.6 },
  { id: "tray", title: "لایه مقوا", note: "سخت و محکم", offset: 4.1, z: 20, labelAt: 64.7 },
  { id: "base", title: "لایه داخلی", note: "محافظ محصول", offset: 0, z: 25, labelAt: 80.1 },
];

const ts = `// GENERATED by scripts/build-exploded-layers.mjs — do not edit by hand.
// Re-run the script after changing the cut coordinates.

export type ExplodedLayer = {
  /** Stable key. */
  id: string;
  /** Label rendered beside the layer, in Persian. */
  title: string;
  /** Secondary line under the title. */
  note: string;
  /** clip-path polygon isolating this layer's silhouette from the shared frame. */
  clipPath: string;
  /**
   * Assembled-state offset, as a percentage of the frame height. Every layer
   * animates from this value to 0, where 0 reproduces the original render.
   * Kept small enough that a band's background never travels far enough to
   * cover the layer beneath it.
   */
  offset: number;
  /** Paint order — a layer must sit in front of whatever it occludes. */
  z: number;
  /** Vertical anchor for the HTML label, as a percentage of frame height. */
  labelAt: number;
};

export const STACK_IMAGE = {
  src: "/images/products/exploded-stack.jpg",
  width: ${CROP.w},
  height: ${CROP.h},
} as const;

export const EXPLODED_LAYERS: ExplodedLayer[] = [
${LAYERS.map(
  (l, i) => `  {
    id: ${JSON.stringify(l.id)},
    title: ${JSON.stringify(l.title)},
    note: ${JSON.stringify(l.note)},
    clipPath:
      "${polygons[i]}",
    offset: ${l.offset},
    z: ${l.z},
    labelAt: ${l.labelAt},
  },`
).join("\n")}
];
`;

const { data, info } = await sharp(SRC)
  .extract({ left: CROP.x, top: CROP.y, width: CROP.w, height: CROP.h })
  .raw()
  .toBuffer({ resolveWithObject: true });

const cleanup = removeLeaderLines(data, info.width, info.height, info.channels);

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: info.channels },
})
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(IMG_OUT);

console.log(
  `leader lines removed: ${cleanup.bands.length ? cleanup.bands.join(", ") : "none"}` +
    `  (${cleanup.repainted} px repainted)`,
);

await writeFile(TS_OUT, ts, "utf8");

const { size } = await stat(IMG_OUT);
console.log(`wrote ${path.relative(ROOT, IMG_OUT)}  ${CROP.w}x${CROP.h}  ${(size / 1024).toFixed(0)} KB`);
console.log(`wrote ${path.relative(ROOT, TS_OUT)}`);
