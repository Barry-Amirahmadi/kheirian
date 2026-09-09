"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExplodedHero from "@/components/hero/ExplodedHero";
import Intro from "@/components/sections/Intro";
import Differentiator from "@/components/sections/Differentiator";
import ProductGallery from "@/components/sections/ProductGallery";
import Process from "@/components/sections/Process";
import Trust from "@/components/sections/Trust";

// Registered globally in SmoothScrollProvider; repeating it here is idempotent
// and removes any dependence on client-module evaluation order.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scroll choreography shared by every section on the page.
 *
 * A section opts in with three attributes:
 *   data-section        the outer <section>, used as the ScrollTrigger target
 *   data-section-inner  a wrapper holding the content, animated on exit
 *   data-reveal         each item that should wipe in on entry
 *
 * Add `data-no-exit` to the final section so it is never left dimmed.
 * Timing lives here rather than in each section.
 */
export default function Home() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
        const inner = section.querySelector<HTMLElement>("[data-section-inner]");
        const items = section.querySelectorAll<HTMLElement>("[data-reveal]");

        // Entrance is a clip-path wipe: the element is uncovered from the
        // bottom edge upward rather than sliding into place. Reduced motion
        // never reaches this block, so the clip is simply never applied and
        // the content renders fully visible.
        if (items.length) {
          gsap.fromTo(
            items,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.25,
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: { trigger: section, start: "top 90%" },
            },
          );
        }

        // Exit is scrubbed, so the outgoing section recedes in step with the
        // incoming one. It runs on the inner wrapper, never the section itself:
        // moving the section would drag its background and open a seam.
        //
        // The final section is exempt — the page cannot scroll far enough to
        // finish its exit, so it would sit permanently dimmed.
        if (inner && !section.hasAttribute("data-no-exit")) {
          gsap.to(inner, {
            opacity: 0.18,
            scale: 0.985,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 72%",
              end: "bottom 12%",
              scrub: 0.6,
            },
          });
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="bg-bg text-ink">
      {/* Outside the skew wrapper on purpose — it is position:fixed, and a
          transformed ancestor would become its containing block. */}
      <Intro />

      {/* The hero sits OUTSIDE the skew wrapper deliberately. It pins, and a
          pinned element inside a transform that changes every frame becomes a
          feedback loop: ScrollTrigger holds it in place by measuring its real
          position, that measurement includes the skew shear, so the correction
          overshoots and the whole page rings by roughly 9px per frame. Barry's
          screen recording showed 13 direction reversals inside the pin window.
          Kept out of the wrapper, the hero has no transformed ancestor and can
          pin the normal way. */}
      <ExplodedHero />

      <div data-scroll-skew>
        <Differentiator />
        <ProductGallery />
        <Process />
        <Trust />
      </div>
    </div>
  );
}
