"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis-instance";

// Client components still evaluate on the server during SSR, and ScrollTrigger
// touches `document` on registration — so guard the register call.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // iOS grows and collapses its address bar as you change scroll direction,
  // which changes window.innerHeight and fires `resize`. ScrollTrigger answers
  // a resize by recomputing every start and end, and mid-scrub that lands as a
  // jump — measured on an iPhone in an in-app browser at up to 54px in a single
  // frame, with 44 direction reversals over 12 seconds of ordinary scrolling.
  // This tells ScrollTrigger to ignore a mobile resize that only changed the
  // height, which is exactly the address-bar case and nothing else.
  //
  // The layout itself is already immune: the only viewport-height units here
  // are `min-h-svh`, and `svh` is measured with the bar expanded, so nothing
  // reflows when it collapses.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// Lenis reports velocity in roughly pixels-per-frame. At a normal wheel pace
// that lands around 10–20, so this factor keeps the skew near 1–2deg for
// ordinary scrolling and only approaches the clamp on a hard flick.
const SKEW_PER_VELOCITY = 0.1;
const SKEW_CLAMP = 6;

// Lenis stops emitting once it settles, so the last event alone cannot be
// relied on to return the page to flat. This timer does it.
const SETTLE_MS = 120;

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // The skew rides on a wrapper that deliberately excludes the fixed-position
    // overlays (intro, cursor) — a transformed ancestor would become their
    // containing block and break them.
    const skewEl = document.querySelector<HTMLElement>("[data-scroll-skew]");

    // skewY shears every descendant vertically by x * tan(angle). Across a
    // 1284px rule at 6deg that is 136px of vertical travel end to end, which
    // reads as a hard diagonal rather than as weight. Anything marked
    // data-skew-level gets the exact inverse written on the same tick, so it
    // stays horizontal while the rest of the page keeps shearing.
    const level = gsap.utils.toArray<HTMLElement>("[data-skew-level]");

    const setSkew = skewEl
      ? gsap.quickTo(skewEl, "skewY", {
          duration: 0.45,
          ease: "power3",
          onUpdate: () => {
            if (!level.length) return;
            // Read back what was actually applied rather than mirroring the
            // target, so the cancellation is exact on every frame.
            gsap.set(level, { skewY: -Number(gsap.getProperty(skewEl, "skewY")) });
          },
        })
      : null;

    let settle: ReturnType<typeof setTimeout> | undefined;

    const onScroll = ({ velocity }: { velocity: number }) => {
      // Every Lenis frame must tell ScrollTrigger to recompute, otherwise
      // triggers fire against the native scroll position Lenis has overridden.
      ScrollTrigger.update();

      if (!setSkew) return;
      setSkew(
        gsap.utils.clamp(-SKEW_CLAMP, SKEW_CLAMP, velocity * SKEW_PER_VELOCITY),
      );
      clearTimeout(settle);
      settle = setTimeout(() => setSkew(0), SETTLE_MS);
    };

    lenis.on("scroll", onScroll);

    // Drive Lenis from GSAP's ticker so both run on one rAF loop.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    setLenis(lenis);
    ScrollTrigger.refresh();

    return () => {
      setLenis(null);
      clearTimeout(settle);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
