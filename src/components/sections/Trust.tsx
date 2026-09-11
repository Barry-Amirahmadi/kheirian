"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TODO = "[TODO: کیهان نما ایلیا باید این عدد را بدهد]";

type Stat = {
  id: string;
  label: string;
  note: string;
  /** Real figure. Stays null until Kheirian supplies it; null renders TODO. */
  value: number | null;
  suffix?: string;
};

const STATS: Stat[] = [
  { id: "years", label: "سال سابقه", note: "از اولین سفارش تا امروز", value: null },
  { id: "clients", label: "برند همکار", note: "در صنایع غذایی و خشکبار", value: null, suffix: "+" },
  { id: "boxes", label: "جعبه تولیدشده", note: "در دوازده ماه گذشته", value: null, suffix: "+" },
  { id: "ontime", label: "تحویل به‌موقع", note: "میانگین سه سال اخیر", value: null, suffix: "٪" },
];

export default function Trust() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(root);

    // Count-up is wired now so a real figure animates the moment it lands in
    // STATS. Rows still holding null render the TODO string and are skipped.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-countup]").forEach((el) => {
        const target = Number(el.dataset.countup);
        if (!Number.isFinite(target)) return;

        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
          onUpdate: () => {
            el.textContent = Math.round(counter.v).toLocaleString("fa-IR");
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="why"
      data-section
      className="mx-auto max-w-[1400px] px-6 py-32 md:px-12"
    >
      <div data-section-inner>
        <div data-skew-level className="rule-gold mb-16" />
        <h2 data-reveal className="text-h2 font-extrabold">
          چرا کیهان نما ایلیا
        </h2>

        <dl className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.id}
              data-reveal
              className="rounded-2xl border border-line bg-surface p-7"
            >
              <dd className="text-h2 font-black text-gradient-gold">
                {stat.value === null ? (
                  <span className="block text-base font-medium leading-relaxed text-muted">
                    {TODO}
                  </span>
                ) : (
                  <>
                    <span data-countup={stat.value}>۰</span>
                    {stat.suffix}
                  </>
                )}
              </dd>
              <dt className="mt-4 text-lg font-extrabold">{stat.label}</dt>
              <p className="mt-1 text-sm text-muted">{stat.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
