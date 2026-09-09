/**
 * One large statement about Kheirian's custom printing.
 *
 * Uses the shared data-section / data-section-inner / data-reveal contract, so
 * the entrance wipe, stagger, scrubbed exit and reduced-motion handling all
 * come from the effect in app/page.tsx — no ScrollTrigger logic of its own.
 */
export default function Differentiator() {
  return (
    <section data-section className="mx-auto max-w-[1400px] px-6 py-40 md:px-12">
      <div data-section-inner>
        <p
          data-reveal
          className="mb-10 text-sm font-medium tracking-[0.35em] text-gold"
        >
          چاپ اختصاصی
        </p>

        <h2
          data-reveal
          className="max-w-[18ch] text-h1 font-black leading-[1.15]"
        >
          هر جعبه‌ای که از خیریان بیرون می‌آید، روی خط چاپ اختصاصی خودِ برند شما
          بسته می‌شود — نه یک قالب آماده.
        </h2>
      </div>
    </section>
  );
}
