import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: this site has no API routes, no server actions and no
  // dynamic segments, so it compiles down to plain HTML in `out/`.
  // That is what Cloudflare Pages serves — no Node runtime involved.
  output: "export",

  // The Next image optimizer needs a server, which a static export has no
  // room for. Every photo here is already sized for its slot, so serving
  // them as authored costs nothing.
  images: { unoptimized: true },

  // Emit `about/index.html` rather than `about.html` so a static host
  // resolves clean URLs without per-host rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
