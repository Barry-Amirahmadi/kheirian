"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reads as one sentence — «محصول شما در امن‌ترین پکیج‌ها» — split across four
 * beats so the flash lands as a phrase rather than four unrelated words.
 */
const WORDS = [
  { text: "محصول", tone: "text-ink" },
  { text: "شما", tone: "text-gradient-gold" },
  { text: "در امن‌ترین", tone: "text-ink" },
  { text: "پکیج‌ها", tone: "text-gradient-gold" },
];

/**
 * Base rhythm, in arbitrary units — only the proportions matter here. Each word
 * occupies `step`; it is visible for most of that, leaving a short blank beat
 * before the next one.
 */
const BASE = { step: 0.52, in: 0.18, outAt: 0.3, out: 0.16, fade: 0.4 };

/** Total runtime, in seconds. */
const TARGET_TOTAL = 3.6;

// Every value is scaled by one factor rather than re-picked by hand, so the
// relative timing between a word's visible span, its fade/scale/blur
// transitions and the gap to the next word survives the change untouched.
const BASE_TOTAL =
  WORDS.length * BASE.step - (BASE.step - BASE.outAt - BASE.out) + BASE.fade;
const SCALE = TARGET_TOTAL / BASE_TOTAL;

const STEP = BASE.step * SCALE;
const IN = BASE.in * SCALE;
const OUT_AT = BASE.outAt * SCALE;
const OUT = BASE.out * SCALE;
const FADE = BASE.fade * SCALE;

export default function Intro() {
  // Rendered on the server so the overlay is painted before the hero is.
  const [visible, setVisible] = useState(true);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    // A reload restores the previous scroll position, which would leave the
    // intro playing over the middle of the page and reveal it on exit.
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    document.documentElement.classList.add("intro-active");

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("intro-active");
          setVisible(false);
          // The hero's pin was measured while the page could not scroll.
          ScrollTrigger.refresh();
        },
      });

      words.forEach((el, i) => {
        const at = i * STEP;
        tl.fromTo(
          el,
          { autoAlpha: 0, scale: 0.86, filter: "blur(16px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: IN,
            ease: "power3.out",
          },
          at,
        ).to(
          el,
          {
            autoAlpha: 0,
            scale: 1.09,
            filter: "blur(12px)",
            duration: OUT,
            ease: "power2.in",
          },
          at + OUT_AT,
        );
      });

      // Blob pulses once per word, a beat ahead of the type.
      words.forEach((_, i) => {
        tl.to(
          ".intro-blob",
          {
            scale: gsap.utils.random(0.82, 1.18, 0.01),
            rotation: (i + 1) * 42,
            duration: STEP,
            ease: "sine.inOut",
          },
          i * STEP,
        );
      });

      tl.to(
        overlay.current,
        { autoAlpha: 0, scale: 1.04, duration: FADE, ease: "power2.inOut" },
        WORDS.length * STEP - (STEP - OUT_AT - OUT),
      );
    }, overlay);

    return () => {
      ctx.revert();
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlay}
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-bg"
    >
      <div className="intro-blob" />

      {/* All four words share one grid cell so they stack dead-centre and the
          box is sized by the widest of them.

          leading + symmetric py exist for Persian descenders. The gold words
          are painted with background-clip: text, and a background only paints
          inside the padding box — so with the display scale's 0.95 line-height
          the bowl of ج in «پکیج‌ها» fell 56.6px below the box and simply got no
          paint, cutting flat. Padding is in em so it tracks the clamped font
          size, and it is applied top and bottom equally so the glyphs stay
          optically centred. */}
      <div className="relative grid place-items-center px-6">
        {WORDS.map((word) => (
          <span
            key={word.text}
            data-word
            style={{ visibility: "hidden" }}
            className={`col-start-1 row-start-1 whitespace-nowrap text-display font-black leading-[1.25] py-[0.4em] will-change-transform ${word.tone}`}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
}
