import type Lenis from "lenis";

/**
 * Lenis owns the scroll position, so anchor navigation has to go through it —
 * a native hash jump or scrollIntoView fights the smoothing and lands wrong.
 * The provider registers the instance here; the header reads it.
 */
let instance: Lenis | null = null;

export function setLenis(value: Lenis | null) {
  instance = value;
}

export function scrollToSection(selector: string, offset = -72) {
  const target = document.querySelector(selector);
  if (!target) return;
  if (instance) {
    instance.scrollTo(target as HTMLElement, { offset });
  } else {
    // Reduced motion tears down Lenis in some setups; fall back to native.
    const y = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
