/**
 * Closing call to action.
 *
 * The values are deliberately placeholders. Inventing a phone number, address
 * or handle for a real company would put plausible-looking but false contact
 * details on a page meant to be shown to that company — these read as obvious
 * blanks instead, in the same shape as the Trust figures.
 */
const FIELDS = [
  { label: "تلفن", value: "[TODO: کیهان نما ایلیا باید شماره تماس را بدهد]" },
  { label: "ایمیل", value: "[TODO: کیهان نما ایلیا باید ایمیل را بدهد]" },
  { label: "اینستاگرام", value: "[TODO: کیهان نما ایلیا باید نشانی صفحه را بدهد]" },
  { label: "نشانی کارخانه", value: "[TODO: کیهان نما ایلیا باید نشانی را بدهد]" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      data-section
      data-no-exit
      className="mx-auto max-w-[1400px] px-6 py-32 md:px-12"
    >
      <div data-section-inner>
        <div data-skew-level className="rule-gold mb-16" />

        <h2 data-reveal className="max-w-[16ch] text-h1 font-black text-gradient-gold pb-[0.45em] -mb-[0.45em]">
          جعبه بعدی برند شما را بسازیم.
        </h2>

        <p data-reveal className="mt-10 max-w-xl text-lead text-muted">
          طرح، ابعاد و تیراژ مورد نظرتان را بفرستید تا نمونه و قیمت را برایتان
          آماده کنیم.
        </p>

        <dl className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field.label} data-reveal className="border-t border-line pt-4">
              <dt className="text-sm font-medium [word-spacing:0.12em] text-gold">
                {field.label}
              </dt>
              <dd className="mt-2 text-base text-muted">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
