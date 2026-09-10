/**
 * Whether this deployment is meant to be found by the public.
 *
 * It is `false` while the page still renders `[TODO: ...]` placeholders for
 * the figures and contact details Kheirian has not supplied yet. A search
 * engine that indexes those strings keeps serving them from its cache long
 * after they are fixed, which means the client could search their own name
 * and find the unfinished draft made for them.
 *
 * Flip to `true` only once every placeholder is replaced with real content.
 * It drives both the robots meta tag and /robots.txt, so one edit covers
 * the whole site.
 */
export const IS_PUBLIC_LAUNCH = false;
