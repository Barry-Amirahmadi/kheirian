"use client";

import { useEffect, useState } from "react";
import { heroDebugState } from "./heroDebugState";

/**
 * On-screen readout of the hero's frame loading, for debugging on a real phone
 * where no console is reachable.
 *
 * Only renders when the URL carries `?debug=1`, so a client opening the plain
 * link never sees it. It exists because "the hero shows only the first frame"
 * has several causes that look identical from the outside, and guessing
 * between them cost more than building this did.
 */
export default function HeroDebug() {
  const [on, setOn] = useState(false);
  const [rows, setRows] = useState<[string, string][]>([]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("debug")) return;
    setOn(true);

    const started = Date.now();
    const id = window.setInterval(() => {
      const s = heroDebugState;
      setRows([
        ["frames", `${s.framesLoaded} / ${s.framesTotal}`],
        ["first frame", s.firstFrameAtMs ? `${s.firstFrameAtMs} ms` : "—"],
        ["all frames", s.allFramesAtMs ? `${(s.allFramesAtMs / 1000).toFixed(1)} s` : "loading…"],
        ["drawn frame", s.drawnFrame < 0 ? "none yet" : String(s.drawnFrame)],
        ["progress", s.progress.toFixed(3)],
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
