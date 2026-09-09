"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const DOT = 12;
const PILL_HEIGHT = 34;
const PILL_PADDING = 36;

/**
 * Follower cursor with lag. Hovering anything carrying `data-cursor-label`
 * morphs the dot into a pill showing that label; leaving it returns to a dot.
 *
 * Lives outside the skewed scroll wrapper — it is position:fixed, and a
 * transformed ancestor would make it scroll with the page.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    // Nothing to replace on a touch device.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = dot.current;
    if (!el) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        // Held hidden until the pointer first moves, so it never renders
        // parked in the top-left corner on load.
        gsap.to(el, { autoAlpha: 1, duration: 0.25 });
      }
    };

    const onOver = (e: MouseEvent) => {
      const hit = (e.target as HTMLElement | null)?.closest?.(
        "[data-cursor-label]",
      );
      setLabel(hit ? hit.getAttribute("data-cursor-label") : null);
    };

    const onLeaveWindow = () => {
      setLabel(null);
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
      shown = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  // Morph between dot and labelled pill. Runs in a layout effect so the label
  // text is in the DOM and measurable before the width is animated.
  useLayoutEffect(() => {
    const el = dot.current;
    const span = text.current;
    if (!el || !span) return;

    if (label) {
      gsap.to(el, {
        width: span.scrollWidth + PILL_PADDING,
        height: PILL_HEIGHT,
        duration: 0.4,
        ease: "expo.out",
      });
      gsap.to(span, { autoAlpha: 1, duration: 0.25, delay: 0.08 });
    } else {
      gsap.to(span, { autoAlpha: 0, duration: 0.15 });
      gsap.to(el, {
        width: DOT,
        height: DOT,
        duration: 0.4,
        ease: "expo.out",
      });
    }
  }, [label]);

  return (
    <div ref={dot} className="cursor-dot" aria-hidden="true">
      <span ref={text} className="cursor-dot__label">
        {label ?? ""}
      </span>
    </div>
  );
}
