/**
 * Path prefix for hosts that serve the site from a subdirectory.
 *
 * GitHub Pages publishes a project repo at `<user>.github.io/<repo>/`, so every
 * absolute asset path needs the repo name in front of it. Next only rewrites
 * paths it controls — `next/link`, `next/image`, its own chunks — and leaves
 * raw strings like `src="/images/x.jpg"` or a fetch URL untouched, which is
 * exactly how a subdirectory deploy ends up with a working page and no images.
 *
 * Set NEXT_PUBLIC_BASE_PATH at build time (see the `build:pages` script).
 * Empty for root-served hosts like Cloudflare Pages, so the same source builds
 * for both without a branch.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix an absolute public-folder path with the base path. */
export const asset = (path: string) => `${BASE_PATH}${path}`;
