/**
 * Mutable snapshot of the hero's frame loading, shared with the ?debug=1
 * overlay. Written by ExplodedHero on every draw, read on a timer by
 * HeroDebug — a plain object rather than state because it changes on every
 * scroll frame and must never trigger a React render.
 */
export const heroDebugState = {
  framesTotal: 0,
  framesLoaded: 0,
  drawnFrame: -1,
  progress: 0,
  firstFrameAtMs: 0,
  allFramesAtMs: 0,
};
