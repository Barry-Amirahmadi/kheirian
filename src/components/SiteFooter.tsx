/**
 * Sits outside the skew wrapper. A full-width top border inside it would be
 * sheared into a diagonal on every fast scroll, which is the same artefact the
 * gold rules needed counter-skewing to avoid.
 */
export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
        <p className="text-lg font-black">کیهان نما</p>
        <p className="text-sm text-muted">
          طراحی و تولید جعبه‌های بسته‌بندی
        </p>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} — تمام حقوق محفوظ است
        </p>
      </div>
    </footer>
  );
}
