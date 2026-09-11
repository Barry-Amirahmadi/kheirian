"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/lenis-instance";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINKS = [
  { href: "#works", label: "نمونه کارها" },
  { href: "#process", label: "ساختار" },
  { href: "#why", label: "چرا کیهان نما ایلیا" },
];

/**
 * Fixed site header.
 *
 * Lives outside the page's skew wrapper on purpose — it is position:fixed, and
 * a transformed ancestor would become its containing block and make it scroll
 * away with the page.
 *
 * The bar is transparent over the hero and picks up a background once the page
 * has moved, so it never sits as a solid slab across the opening shot. No
 * backdrop-filter: a full-width blur repainting on every scroll frame is the
 * kind of cost this page cannot afford.
 *
 * Below md the links move into a full-screen panel behind a toggle. They used
 * to be simply `hidden` with nothing in their place, so a phone had no
 * navigation at all — the whole nav was invisible rather than adapted.
 */
export default function SiteHeader() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      start: 120,
      onToggle: (self) => el.classList.toggle("is-scrolled", self.isActive),
    });

    return () => trigger.kill();
  }, []);

  // While the panel is open the page behind it must not scroll, and Escape
  // must close it — a menu that traps a visitor is worse than no menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      ref={root}
      className="site-header fixed inset-x-0 top-0 z-50 transition-colors duration-300"
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-8 px-6 py-4 md:px-12">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("body", 0);
          }}
          className="text-lg font-black tracking-tight text-ink"
        >
          کیهان نما
        </a>

        <nav className="hidden flex-1 items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => go(e, link.href)}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(e) => go(e, "#contact")}
          data-cursor-label="تماس"
          // Hidden on mobile while the panel is open: the panel carries its own,
          // larger contact button and two at once reads as a mistake.
          className={`mr-auto rounded-full border border-gold-line px-5 py-2 text-sm font-extrabold text-gold transition-colors hover:bg-gold hover:text-bg md:mr-0 ${
            menuOpen ? "hidden md:inline-block" : ""
          }`}
        >
          تماس بگیرید
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
          // 44px minimum touch target, which the icon alone would not meet.
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center text-ink md:hidden"
        >
          <span className="relative block h-4 w-6" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute left-0 block h-[2px] w-full bg-current transition-all duration-300"
                style={
                  menuOpen
                    ? {
                        top: "7px",
                        transform:
                          i === 1 ? "scaleX(0)" : `rotate(${i === 0 ? 45 : -45}deg)`,
                        opacity: i === 1 ? 0 : 1,
                      }
                    : { top: `${i * 7}px` }
                }
              />
            ))}
          </span>
        </button>
      </div>

      {/* Full-screen on purpose: three Persian labels, a long brand name and a
          contact button do not coexist in a 375px bar. */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="fixed inset-0 top-0 z-40 flex flex-col items-start justify-center gap-2 bg-bg px-8 md:hidden"
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => go(e, link.href)}
            className="py-3 text-3xl font-black text-ink transition-colors hover:text-gold"
          >
            {link.label}
          </a>
        ))}

        <a
          href="#contact"
          onClick={(e) => go(e, "#contact")}
          className="mt-6 rounded-full border border-gold-line px-6 py-3 text-base font-extrabold text-gold"
        >
          تماس بگیرید
        </a>
      </div>
    </header>
  );
}
