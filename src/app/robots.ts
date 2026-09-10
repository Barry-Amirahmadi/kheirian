import type { MetadataRoute } from "next";
import { IS_PUBLIC_LAUNCH } from "@/lib/launch";

// Required under `output: export`: without it Next treats a route handler
// as dynamic and the build fails rather than emitting a file.
export const dynamic = "force-static";

// Replaces the robots.txt Cloudflare serves by default, which only addresses
// AI crawlers and does nothing to stop ordinary search indexing.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: IS_PUBLIC_LAUNCH
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
  };
}
