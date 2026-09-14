"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "@/lib/lenis-instance";

const LINKS = [
  { href: "#works", label: "نمونه کارها" },
  { href: "#process", label: "ساختار" },
  // "چرا ما", not the full brand name: the logo two inches to the right now
  // spells out "کیهان نما ایلیا", and repeating it in the very next element
  // reads as a mistake. The section's own heading still carries the long form.
  { href: "#why", label: "چرا ما" },
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

    // A plain scroll listener, deliberately not a ScrollTrigger.
    //
    // This used to be `ScrollTrigger.create({ start: 120, onToggle })`, and it
    // stopped being active partway down the page: measured is-scrolled true at
    // scrollY 2400 but false at 5400 and 6400, so the bar went transparent
    // again over the whole lower half of the site and the page text ran
    // straight through the nav links. Giving the trigger an explicit
    // `end: maxScroll + 200` did not help, and the state was identical whether
    // the scroll went through Lenis or not, so it is not a stale-update
    // problem either — the reason inside GSAP was never pinned down.
    //
    // It does not need to be: this is one boolean about the scroll position,
    // Lenis scrolls the window natively so `scrollY` is authoritative, and a
    // passive listener has none of the refresh and pin-spacer machinery that
    // made the trigger version fragile.
    const sync = () => el.classList.toggle("is-scrolled", window.scrollY > 120);
    sync();
    window.addEventListener("scroll", sync, { passive: true });

    return () => window.removeEventListener("scroll", sync);
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
      {/* gap-4 below md: the full brand name, the contact pill and the toggle
          measure 364px together at 390px wide, and gap-8 pushed that to 396 —
          six pixels of overflow. */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-4 md:gap-8 md:px-12">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("body", 0);
          }}
          className="shrink-0 whitespace-nowrap text-base font-black tracking-tight text-ink md:text-lg"
        >
          کیهان نما ایلیا
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
