"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/lenis-instance";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LINKS = [
  { href: "#works", label: "نمونه کارها" },
  { href: "#process", label: "ساختار" },
  { href: "#why", label: "چرا خیریان" },
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
 */
export default function SiteHeader() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      start: 120,
      onToggle: (self) => el.classList.toggle("is-scrolled", self.isActive),
    });

    return () => trigger.kill();
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
          خیریان
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
          className="mr-auto rounded-full border border-gold-line px-5 py-2 text-sm font-extrabold text-gold transition-colors hover:bg-gold hover:text-bg md:mr-0"
        >
          تماس بگیرید
        </a>
      </div>
    </header>
  );
}
