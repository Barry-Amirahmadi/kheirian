"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRODUCTS } from "@/data/products";
import { asset } from "@/lib/base-path";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TILT = 6;

/**
 * Works index. Entrance comes from the shared data-reveal wipe; everything
 * here is the two motions that are specific to this section:
 *
 *  - a cursor-driven 3D tilt on the thumbnail (rotationX/rotationY)
 *  - a scroll-driven parallax drift on the image inside it (yPercent)
 *
 * They target different elements and different properties, so they compose
 * instead of fighting over one transform.
 */
export default function ProductGallery() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        motionOK: "(prefers-reduced-motion: no-preference)",
        // Tilt is driven by mousemove, which a touch screen never fires in a
        // useful way. Gate it on a real pointer so touch gets the parallax
        // only, rather than thumbnails frozen at whatever angle a tap left.
        finePointer: "(pointer: fine)",
      },
      (context) => {
        const { motionOK, finePointer } = context.conditions as {
          motionOK: boolean;
          finePointer: boolean;
        };
        if (!motionOK) return;
      const cleanups: Array<() => void> = [];

      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((figure) => {
        let rotX: ReturnType<typeof gsap.quickTo> | null = null;
        let rotY: ReturnType<typeof gsap.quickTo> | null = null;

        // Rebuilt on every enter: the elastic return below overwrites these
        // tweens, and a killed quickTo will not drive the element again.
        const onEnter = () => {
          rotX = gsap.quickTo(figure, "rotationX", {
            duration: 0.5,
            ease: "power3",
          });
          rotY = gsap.quickTo(figure, "rotationY", {
            duration: 0.5,
            ease: "power3",
          });
        };

        const onMove = (e: MouseEvent) => {
          const r = figure.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          rotX?.(-ny * TILT * 2);
          rotY?.(nx * TILT * 2);
        };

        const onLeave = () => {
          gsap.to(figure, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
          });
        };

        if (finePointer) {
          figure.addEventListener("mouseenter", onEnter);
          figure.addEventListener("mousemove", onMove);
          figure.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            figure.removeEventListener("mouseenter", onEnter);
            figure.removeEventListener("mousemove", onMove);
            figure.removeEventListener("mouseleave", onLeave);
          });
        }

        // Independent of the tilt — driven by scroll position, not the cursor.
        const image = figure.querySelector<HTMLElement>("[data-parallax]");
        if (image) {
          gsap.fromTo(
            image,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: figure,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

        return () => cleanups.forEach((fn) => fn());
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="works"
      data-section
      className="mx-auto max-w-[1400px] px-6 py-32 md:px-12"
    >
      <div data-section-inner>
        <div data-skew-level className="rule-gold mb-16" />
        <h2 data-reveal data-shimmer="gold" className="text-h2 font-extrabold">
          نمونه کارها
        </h2>

        <ul className="mt-14">
          {PRODUCTS.map((product) => (
            <li
              key={product.id}
              data-reveal
              data-cursor-label="مشاهده"
              style={{ perspective: "900px" }}
              className="grid grid-cols-[auto_1fr] items-center gap-6 border-t border-line py-7 md:grid-cols-[auto_1fr_auto] md:gap-10"
            >
              <span className="text-sm font-medium text-gold">
                {product.number}
              </span>

              <div>
                <h3 className="text-2xl font-extrabold md:text-3xl">
                  {product.title}
                </h3>
                <p className="mt-2 max-w-md text-sm text-muted">
                  {product.description}
                </p>
              </div>

              <figure
                data-tilt
                className="relative col-span-2 h-36 w-full overflow-hidden rounded-xl border border-line md:col-span-1 md:h-28 md:w-52"
              >
                <Image
                  data-parallax
                  src={asset(product.imageSrc)}
                  alt={product.alt}
                  width={1195}
                  height={896}
                  sizes="(min-width: 768px) 208px, 100vw"
                  // Overscaled so the parallax drift never exposes an edge.
                  style={{ top: "-15%", height: "130%" }}
                  className="absolute inset-x-0 w-full object-cover"
                />
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
