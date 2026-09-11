import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-bg px-6 text-center">
      {/* letter-spacing is safe here and only here: Persian digits are
          standalone glyphs with no joining forms to break. On any Persian
          word it separates the letters outright in WebKit. */}
      <p className="text-sm font-medium tracking-[0.35em] text-gold">۴۰۴</p>

      <h1 className="text-h1 font-black text-gradient-gold pb-[0.45em] -mb-[0.45em]">
        این صفحه پیدا نشد
      </h1>

      <p className="max-w-md text-lead text-muted">
        نشانی که دنبالش بودید وجود ندارد یا جابه‌جا شده است.
      </p>

      <Link
        href="/"
        className="rounded-full border border-gold-line px-6 py-3 text-sm font-extrabold text-gold transition-colors hover:bg-gold hover:text-bg"
      >
        بازگشت به صفحه اصلی
      </Link>
    </main>
  );
}
