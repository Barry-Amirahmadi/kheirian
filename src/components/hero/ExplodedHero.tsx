"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIDEO_SRC = "/videos/exploded-view-final.mp4";

/**
 * Hero: the carton exploding, scrubbed by scroll.
 *
 * The video is driven by setting currentTime from the pin's progress rather
 * than being played, so it runs forward and backward with the scroll. The
 * source is re-encoded all-intra (every frame a keyframe) — with the original
 * single-keyframe encode every seek had to decode from frame 0 and scrubbing
 * was unusable, especially in reverse.
 *
 * The previous clip-path implementation is kept whole in ExplodedHeroLayers.tsx
 * as a drop-in fallback.
 */
export default function ExplodedHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        // Explicit mobile query on purpose. gsap.matchMedia only runs the
        // callback when at least one condition matches, so with only
        // isDesktop + reduced a phone matched nothing, the callback never ran,
        // and the hero sat frozen on its first frame with no ScrollTrigger.
        isMobile: "(max-width: 1023px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduced } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduced: boolean;
        };

        const el = video.current;
        const stage = root.current?.querySelector<HTMLElement>(".hero-stage");
        const hint = root.current?.querySelector<HTMLElement>(".hero-scroll-hint");
        if (!el) return;

        // Reduced motion: show the finished diagram, no pin, no scrub.
        if (reduced) {
          const settle = () => {
            el.currentTime = el.duration || 0;
          };
          if (el.readyState >= 1) settle();
          else el.addEventListener("loadedmetadata", settle, { once: true });
          return;
        }

        // A seek before metadata lands is silently dropped, so hold the last
        // requested progress and apply it once the duration is known.
        let pending = 0;
        let ready = el.readyState >= 1;

        const seek = (progress: number) => {
          pending = progress;
          if (!ready || !el.duration) return;
          // Clamped just inside the end: seeking exactly to duration parks some
          // browsers on a blank frame.
          el.currentTime = Math.min(progress * el.duration, el.duration - 0.02);
        };

        const onMeta = () => {
          ready = true;
          seek(pending);
          ScrollTrigger.refresh();
        };
        if (!ready) el.addEventListener("loadedmetadata", onMeta);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            // Desktop pins for 170% of the viewport. Mobile cannot pin — the
            // stacked hero is taller than the screen — so it scrubs over one
            // full viewport of travel instead. Triggering on the short 16:9
            // stage there raced the whole 10s clip past in ~560px of scroll.
            end: isDesktop ? "+=170%" : "+=100%",
            scrub: 0.9,
            pin: isDesktop,
            // Same pin window as the clip-path hero it replaces.
            onUpdate: (self) => seek(self.progress),
          },
        });

        if (hint) tl.to(hint, { autoAlpha: 0, duration: 0.3 }, 0);

        return () => {
          el.removeEventListener("loadedmetadata", onMeta);
        };
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh items-center overflow-hidden bg-bg py-16 lg:py-0"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-12 px-6 md:px-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        <div>
          <p className="mb-6 text-sm font-medium tracking-[0.35em] text-gold">
            خیریان · بسته‌بندی
          </p>

          <h1 className="text-display font-black text-gradient-gold pb-[0.45em] -mb-[0.45em]">
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

        <div
          className="hero-stage relative w-full overflow-hidden rounded-[1.75rem] border border-gold-line shadow-2xl shadow-black/60"
          style={{ aspectRatio: "16 / 9", willChange: "transform" }}
        >
          <video
            ref={video}
            src={VIDEO_SRC}
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* The video carries its own Persian layer annotations, so the
              description here is the accessible equivalent of the finished
              diagram rather than a duplicate label set. */}
          <span className="sr-only">
            نمای انفجاری کارتن پنج لایه پسته فلات: لایه چاپی بیرونی، لایه مقوا،
            لایه فلوت، لایه مقوا و لایه داخلی محافظ، همراه با ضخامت هر لایه.
          </span>
        </div>
      </div>
    </section>
  );
}
