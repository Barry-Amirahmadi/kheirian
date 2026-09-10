"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroDebug from "./HeroDebug";

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
 * The file is fetched and handed to the element as a blob URL rather than
 * loaded from its own path. A browser refuses to seek a media resource whose
 * origin does not advertise `Accept-Ranges`, and Cloudflare Pages does not send
 * it for this file: measured on the deployed site, `buffered` reached 0-10s and
 * readyState hit 4 while `seekable` stayed [0, 0], so every currentTime write
 * was silently clamped to 0 and the hero never moved. A blob is local, so it is
 * always seekable, which makes the scrub independent of the host entirely.
 *
 * The previous clip-path implementation is kept whole in ExplodedHeroLayers.tsx
 * as a drop-in fallback.
 */
export default function ExplodedHero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  // Pull the video down ourselves and swap in a blob URL. Kept separate from
  // the ScrollTrigger effect below so a re-measure never re-downloads 3 MB.
  useEffect(() => {
    const el = video.current;
    if (!el) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    fetch(VIDEO_SRC)
      .then((res) => {
        if (!res.ok) throw new Error(`video ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        el.src = objectUrl;

        // iOS Safari paints nothing for a video that has never played: the
        // seek is accepted and currentTime moves, but the element keeps
        // showing its poster, so the hero looks frozen on frame 0. A muted
        // play/pause pair forces one decode and unlocks frame rendering.
        // Muted inline playback needs no user gesture, so this is allowed to
        // run on load; if a browser refuses anyway, the catch keeps the rest
        // of the hero working.
        el.addEventListener(
          "loadeddata",
          () => {
            const unlock = el.play();
            if (unlock && typeof unlock.then === "function") {
              unlock.then(() => el.pause()).catch(() => {});
            } else {
              el.pause();
            }
          },
          { once: true },
        );
      })
      .catch(() => {
        // Network or CORS failure: fall back to the plain path. Scrubbing will
        // not work if the host withholds ranges, but the diagram still renders
        // rather than the hero collapsing to an empty box.
        if (!cancelled) el.src = VIDEO_SRC;
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

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
        const hint = root.current?.querySelector<HTMLElement>(".hero-scroll-hint");
        if (!el) return;

        // Reduced motion: show the finished diagram, no pin, no scrub.
        if (reduced) {
          const settle = () => {
            el.currentTime = el.duration || 0;
          };
          if (el.readyState >= 1) settle();
          else el.addEventListener("loadeddata", settle, { once: true });
          return;
        }

        // Readiness is seekability, not metadata. readyState and buffered both
        // report a fully available video on a host that withholds Accept-Ranges,
        // while seekable stays empty and every write to currentTime is dropped —
        // so gating on metadata alone reintroduces the silent-no-op bug.
        const canSeek = () => el.seekable.length > 0 && el.seekable.end(0) > 0;

        // Scroll position while the blob is still downloading is held here and
        // applied the moment it becomes seekable, so a visitor who scrolls
        // immediately lands on the right frame instead of a stale one.
        let pending = 0;
        let ready = canSeek();

        const seek = (progress: number) => {
          pending = progress;
          if (!ready || !el.duration) return;
          // Clamped just inside the end: seeking exactly to duration parks some
          // browsers on a blank frame.
          el.currentTime = Math.min(progress * el.duration, el.duration - 0.02);
        };

        const onLoaded = () => {
          if (!canSeek()) return;
          ready = true;
          seek(pending);
          ScrollTrigger.refresh();
        };
        if (!ready) {
          el.addEventListener("loadeddata", onLoaded);
          el.addEventListener("canplay", onLoaded);
        }

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
          el.removeEventListener("loadeddata", onLoaded);
          el.removeEventListener("canplay", onLoaded);
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
            // No src attribute: the effect above assigns a blob URL, and
            // leaving the plain path here too would download the file twice.
            // preload is still "auto" because it costs nothing with no src to
            // load, and "none" made the browser hold metadata only -- seeks
            // were accepted, fired `seeked`, then snapped back to 0 because no
            // frames were retained.
            // The poster is frame 0, so the hero looks finished while it loads.
            poster="/images/hero-poster.jpg"
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

      {/* Renders only with ?debug=1 in the URL. */}
      <HeroDebug />
    </section>
  );
}
