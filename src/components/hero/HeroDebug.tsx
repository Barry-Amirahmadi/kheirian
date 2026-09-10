"use client";

import { useEffect, useState } from "react";

/**
 * On-screen readout of the hero video's state, for debugging on a real phone
 * where no console is reachable.
 *
 * Only renders when the URL carries `?debug=1`, so a client opening the plain
 * link never sees it. It exists because "the hero shows only the first frame"
 * has two completely different causes that look identical: the blob never
 * arrived and the poster is what's on screen, or the video loaded fine and the
 * browser is refusing to paint a seeked frame. These fields tell them apart.
 */
export default function HeroDebug() {
  const [on, setOn] = useState(false);
  const [rows, setRows] = useState<[string, string][]>([]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("debug")) return;
    setOn(true);

    const started = Date.now();
    const id = window.setInterval(() => {
      const v = document.querySelector("video");
      if (!v) {
        setRows([["video element", "NOT FOUND"]]);
        return;
      }
      const seekable = v.seekable.length
        ? `[${v.seekable.start(0).toFixed(1)}, ${v.seekable.end(0).toFixed(1)}]`
        : "[] EMPTY";
      const buffered = v.buffered.length
        ? `[${v.buffered.start(0).toFixed(1)}, ${v.buffered.end(0).toFixed(1)}]`
        : "[] EMPTY";

      setRows([
        ["src", v.currentSrc.startsWith("blob:") ? "BLOB ✓" : "direct path ✗"],
        ["readyState", `${v.readyState} / 4`],
        ["seekable", seekable],
        ["buffered", buffered],
        ["duration", Number.isFinite(v.duration) ? v.duration.toFixed(2) : "—"],
        ["currentTime", v.currentTime.toFixed(2)],
        ["paused", String(v.paused)],
        ["error", v.error ? `code ${v.error.code}` : "none"],
        ["scrollY", String(Math.round(window.scrollY))],
        ["elapsed", `${((Date.now() - started) / 1000).toFixed(0)}s`],
      ]);
    }, 250);

    return () => window.clearInterval(id);
  }, []);

  if (!on) return null;

  return (
    <div
      dir="ltr"
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: 99999,
        background: "rgba(0,0,0,0.88)",
        color: "#E8C766",
        font: "11px/1.5 ui-monospace, monospace",
        padding: "8px 10px",
        borderRadius: 8,
        border: "1px solid rgba(232,199,102,0.35)",
        pointerEvents: "none",
        maxWidth: "58vw",
      }}
    >
      {rows.map(([k, v]) => (
        <div key={k}>
          <span style={{ opacity: 0.6 }}>{k}:</span> {v}
        </div>
      ))}
    </div>
  );
}
