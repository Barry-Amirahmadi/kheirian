# خیریان — سایت بسته‌بندی

Marketing site for Kheirian packaging. Next.js 15 (App Router), TypeScript,
Tailwind v4, RTL Persian throughout, with a GSAP + Lenis scroll motion system.

## Running locally

```bash
npm run dev
```

Then open <http://localhost:3000>. First compile takes 10–15s.

```bash
npm run build && npm start   # production build
```

## Recording the demo video

The site is built around scroll, so the recording is most of the pitch.

**Window setup**

Launch Chrome in app mode so there is no address bar, tab strip or bookmarks
in frame:

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --app=http://localhost:3000
```

**Checklist**

- [ ] Dev server running, page hard-reloaded (`Ctrl+Shift+R`) so no stale bundle
- [ ] Only one dev server running — a second one on another port competes for CPU
- [ ] Close other heavy apps; screen recorders and Next dev both want CPU
- [ ] Record at 1080p or higher, 60fps if the recorder supports it
- [ ] Full screen, no address bar visible (use the `--app=` command above)
- [ ] Reload right before recording so the intro sequence plays from the start
- [ ] Let the intro finish (~2.4s) before scrolling
- [ ] Scroll **slowly and continuously** — the hero pin and the section
      hand-offs are scroll-scrubbed, so an even pace reads far better than
      flicks. Fast flicks also push the velocity skew to its limit.
- [ ] Pause briefly on the hero once the five layers have fully separated
- [ ] Hover a gallery item so the cursor morphs to «مشاهده» and the tilt shows
- [ ] Scroll all the way to the contact section

## Still to come

- Real figures for the Trust cards and real contact details — both currently
  render explicit `[TODO: ...]` placeholders rather than invented values
- Real copy and photography for the last two gallery items
- `metadataBase` in `src/app/layout.tsx` must point at the real domain before
  deploy, or social link previews will not resolve

## Regenerating the exploded-view layers

The hero and process diagrams slice one photograph into five clipped layers.
If the source render changes, re-run:

```bash
node scripts/build-exploded-layers.mjs
```

It re-crops the stack, paints out the source's annotation leader lines, and
regenerates `src/lib/exploded-layers.ts`.
