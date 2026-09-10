/**
 * FALLBACK — not currently rendered.
 *
 * The original hero: the exploded view built by clipping one still photograph
 * into five layers and separating them on a scrubbed timeline. Superseded by
 * the scroll-scrubbed video in ExplodedHero.tsx, and kept intact because the
 * video approach depends on the browser honouring programmatic seeks on a
 * muted inline <video>, which is exactly the thing iOS Safari has historically
 * been unreliable about. If the video hero misbehaves in the field, swap this
 * component back in at src/app/page.tsx -- it needs no other changes.
 *
 * Its clip-path data in src/lib/exploded-layers.ts is still live: the Process
 * section uses the same five-layer technique.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPLODED_LAYERS, STACK_IMAGE } from "@/lib/exploded-layers";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sampled from the render's own background so the area a layer vacates while
// it travels is indistinguishable from the photograph behind it.
const STAGE_BG =
  "linear-gradient(180deg, #f2e8e1 0%, #ede3da 45%, #e4dad1 100%)";

export default function ExplodedHeroLayers() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-layer]"));
    const labels = Array.from(el.querySelectorAll<HTMLElement>("[data-label]"));
    const stage = el.querySelector<HTMLElement>(".hero-stage");
    const hint = el.querySelector<HTMLElement>(".hero-scroll-hint");
    if (!stage) return;

    // Elements are looked up here and passed to GSAP directly rather than as
    // selector text: gsap.matchMedia() does not resolve a React ref as a scope
    // the way gsap.context() does, so scoped selectors would silently match
    // nothing and the whole animation would no-op.
    const mm = gsap.matchMedia();

    mm.add(
      {
        // isMobile looks redundant next to isDesktop, but it is load-bearing:
        // matchMedia only invokes the callback when at least one condition
        // matches. Without it, a narrow screen with no reduced-motion
        // preference matches nothing and the animation never runs at all.
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduced } = context.conditions as {
          isDesktop: boolean;
          reduced: boolean;
        };

        // Reduced motion gets the finished exploded view, no pin, no scrub.
        if (reduced) {
          gsap.set(layers, { yPercent: 0 });
          gsap.set(labels, { autoAlpha: 1, x: 0 });
          return;
        }

        // Assembled state: every layer sits low, closed into the carton. Each
        // offset is small enough that a band's background never reaches the
        // layer beneath it, so nothing is ever erased mid-flight.
        layers.forEach((layer) => {
          gsap.set(layer, { yPercent: Number(layer.dataset.offset) });
        });
        gsap.set(labels, { autoAlpha: 0, x: 28 });

        // Pinning is only safe while the whole hero fits on screen. Below lg the
        // copy, stage and label list stack taller than the viewport, so pinning
        // would park the labels off-screen for the entire scroll. There the
        // explode is driven by the stage's own travel through the viewport.
        const tl = gsap.timeline({
          scrollTrigger: isDesktop
            ? {
                trigger: el,
                start: "top top",
                end: "+=170%",
                scrub: 0.9,
                pin: true,
                // anticipatePin is deliberately off. It un-pins early to hide
                // a flash on fast scroll, but Lenis already hands ScrollTrigger
                // an interpolated position, so all it did here was release the
                // hero ~53px before the pin end and then correct — a two-step
                // hand-off that measured as a 53px jump on the frame after
                // release. Without it the release lands on the pin end.
              }
            : {
                trigger: stage,
                start: "top 85%",
                end: "bottom 40%",
                scrub: 0.9,
              },
        });

        // All layers travel together on one ease, deliberately un-staggered.
        // Each layer's offset is a fixed fraction of the lid's, so a shared
        // curve keeps every gap proportional and no pair can ever drift further
        // apart than the source render. Staggering the starts breaks that: an
        // earlier layer decays first, overshoots its neighbour, and opens a
        // background-coloured sliver along an edge that is flush in the photo.
        // The layers still read as separate because they travel different
        // distances — the lid moves roughly seven times as far as the tray.
        layers.forEach((layer) => {
          tl.to(layer, { yPercent: 0, ease: "power2.inOut", duration: 1 }, 0);
        });

        // Each label arrives just after its layer settles.
        labels.forEach((label, i) => {
          tl.to(
            label,
            { autoAlpha: 1, x: 0, duration: 0.45, ease: "power2.out" },
            0.45 + i * 0.1,
          );
        });

        // Deliberately shorter than the timeline. Spanning the full duration
        // meant that, with the scrub lag, the stage was still scaling for
        // roughly 400px of scroll after the pin had already released — so at
        // the hand-off the hero was translating and scaling at the same time,
        // which is what read as judder, and it left the stage sitting at a
        // non-integer scale exactly during the exit. Settling at 60% leaves the
        // rest of the pin at a locked scale of 1 with room for the scrub to
        // catch up before release, even on a hard flick.
        tl.fromTo(
          stage,
          { scale: 0.95 },
          { scale: 1, ease: "power1.out", duration: tl.duration() * 0.45 },
          0,
        );

        if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.3 }, 0);
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh items-center overflow-hidden bg-bg py-16 lg:py-0"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        {/* ------------------------------------------------------------ copy */}
        <div>
          <p className="mb-6 text-sm font-medium tracking-[0.35em] text-gold">
            خیریان · بسته‌بندی
          </p>

          <h1
            // pb extends the gradient's paint area past the baseline so the
            // descender of ج in «جعبه» is painted; the matching negative margin
            // cancels it in layout, so nothing below the heading moves.
            className="text-display font-black text-gradient-gold pb-[0.45em] -mb-[0.45em]"
          >
            پنج لایه،
            <br />
            یک جعبه
          </h1>

          <p className="mt-8 max-w-lg text-lead font-normal text-muted">
            ساختار کارتن پنج لایه فلات پسته — از مقوای خام تا خط طلایی روی درب.
            هر لایه یک کار مشخص دارد: استحکام، جذب ضربه، و محافظت از محصول تا
            رسیدن به دست مشتری.
          </p>

          <p className="hero-scroll-hint mt-10 flex items-center gap-3 text-sm text-muted">
            <span className="inline-block h-8 w-5 rounded-full border border-gold-line">
              <span className="mx-auto mt-1.5 block h-1.5 w-1 rounded-full bg-gold" />
            </span>
            اسکرول کنید تا لایه‌ها باز شوند
          </p>
        </div>

        {/* --------------------------------------------------------- diagram */}
        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          {/* Labels: a plain list on small screens, pinned beside each layer on lg. */}
          <div className="lg:relative lg:w-40 lg:shrink-0">
            <ul className="space-y-4 lg:space-y-0">
              {EXPLODED_LAYERS.map((layer) => (
                <li
                  key={layer.id}
                  data-label
                  style={{ top: `${layer.labelAt}%` }}
                  className="flex items-center gap-3 lg:absolute lg:inset-x-0 lg:-translate-y-1/2"
                >
                  <div className="flex-1 text-right">
                    <p className="text-sm font-extrabold text-ink lg:text-[0.9rem]">
                      {layer.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{layer.note}</p>
                  </div>
                  <span className="hidden shrink-0 items-center lg:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="h-px w-7 bg-gold-line" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stage: five clipped copies of one render, stacked and offset. */}
          <div
            className="hero-stage relative w-full overflow-hidden rounded-[1.75rem] border border-gold-line shadow-2xl shadow-black/60 lg:flex-1"
            style={{
              aspectRatio: `${STACK_IMAGE.width} / ${STACK_IMAGE.height}`,
              background: STAGE_BG,
              // Keeps the stage on one compositing path whatever its scale, so
              // the rounded-corner clip cannot be applied differently at
              // scale 1 than mid-animation.
              willChange: "transform",
            }}
          >
            {EXPLODED_LAYERS.map((layer) => (
              <div
                key={layer.id}
                data-layer
                data-offset={layer.offset}
                className="absolute inset-0 will-change-transform"
                style={{ clipPath: layer.clipPath, zIndex: layer.z }}
              >
                <Image
                  src={STACK_IMAGE.src}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 90vw"
                  className="object-cover"
                  onLoad={() => ScrollTrigger.refresh()}
                />
              </div>
            ))}

            {/* Accessible description — the layers themselves are decorative. */}
            <span className="sr-only">
              نمای انفجاری کارتن پنج لایه پسته فلات، شامل لایه چاپی بیرونی، دو
              لایه مقوا، لایه فلوت و لایه داخلی محافظ.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
