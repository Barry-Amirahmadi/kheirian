"use client";

import { useEffect } from "react";

/**
 * Starts and stops the `data-shimmer` text animation as elements enter and
 * leave the viewport.
 *
 * The animation itself is pure CSS; this only toggles a class. That split is
 * deliberate — a looping gradient repaints the text on every frame, and this
 * page already spends its frame budget on a scroll-driven canvas and a
 * per-frame skew. Letting three or four shimmering lines run permanently, most
 * of them off screen, is a cost with nothing to show for it.
 *
 * Mounted once, near the root. New shimmer targets need no wiring: mark the
 * element `data-shimmer` and it is picked up.
 */
export default function ShimmerText() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-shimmer]");
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-shimmering", entry.isIntersecting);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
