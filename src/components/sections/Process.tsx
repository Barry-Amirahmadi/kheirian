"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPLODED_LAYERS, STACK_IMAGE } from "@/lib/exploded-layers";
import { asset } from "@/lib/base-path";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STAGE_BG =
  "linear-gradient(180deg, #f2e8e1 0%, #ede3da 45%, #e4dad1 100%)";

/**
 * The five-layer structure, reusing the hero's clipped-layer technique at a
 * smaller size and without a pin — the explode is scrubbed against this
 * section's own travel through the viewport, so the page never stops scrolling.
 *
 * Layers use `data-process-layer` rather than the hero's `data-layer` so the
 * two diagrams can never select into each other.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-process-layer]");
      if (!layers.length) return;

      layers.forEach((el) => {
        gsap.set(el, { yPercent: Number(el.dataset.offset) });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".process-stage",
          start: "top 85%",
          end: "bottom 40%",
          scrub: 0.8,
        },
      });

      layers.forEach((el, i) => {
        tl.to(el, { yPercent: 0, ease: "power2.inOut", duration: 1 }, i * 0.13);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="process"
      data-section
      className="mx-auto max-w-[1400px] px-6 py-32 md:px-12"
    >
      <div data-section-inner>
        <div data-skew-level className="rule-gold mb-16" />

        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div>
            <h2 data-reveal data-shimmer="gold" className="text-h2 font-extrabold">
              ساختار پنج لایه
            </h2>

            <p data-reveal className="mt-6 max-w-lg text-lead text-muted">
              مقوای پنج لایه ضربه را پیش از رسیدن به محصول می‌گیرد. لایه فلوت
              فشار را پخش می‌کند، دو لایه مقوا شکل جعبه را در انبار و حمل حفظ
              می‌کنند، و لایه داخلی مانع تماس محصول با سطح چاپ‌شده می‌شود.
            </p>

            <ol className="mt-10 space-y-3">
              {EXPLODED_LAYERS.map((layer, i) => (
                <li
                  key={layer.id}
                  data-reveal
                  className="flex items-baseline gap-4 border-t border-line pt-3"
                >
                  <span className="text-xs font-medium text-gold">
                    {(i + 1).toLocaleString("fa-IR")}
                  </span>
                  <span className="flex-1 font-extrabold">{layer.title}</span>
                  <span className="text-sm text-muted">{layer.note}</span>
                </li>
              ))}
            </ol>
          </div>

          <div
            className="process-stage relative w-full overflow-hidden rounded-[1.5rem] border border-gold-line"
            style={{
              aspectRatio: `${STACK_IMAGE.width} / ${STACK_IMAGE.height}`,
              background: STAGE_BG,
            }}
          >
            {EXPLODED_LAYERS.map((layer) => (
              <div
                key={layer.id}
                data-process-layer
                data-offset={layer.offset}
                className="absolute inset-0 will-change-transform"
                style={{ clipPath: layer.clipPath, zIndex: layer.z }}
              >
                <Image
                  src={asset(STACK_IMAGE.src)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 38vw, 90vw"
                  className="object-cover"
                />
              </div>
            ))}

            {/* The five layers are one photograph clipped five ways, so each
                copy stays decorative (alt="") and the composite gets a single
                description here. Real alt on all five would make a screen
                reader read the same sentence five times over. */}
            <span className="sr-only">
              نمای انفجاری کارتن پنج لایه: لایه چاپی بیرونی، لایه مقوا، لایه
              فلوت، لایه مقوا و لایه داخلی محافظ، از بالا به پایین.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
