import type { Locale } from "@/i18n/config";
import { PAGES } from "@/i18n/pages";

/**
 * Native <details> keeps every answer in the HTML (search engines read it)
 * while still collapsing them; `name` makes it a one-open-at-a-time accordion.
 */
export default function FAQ({ locale }: { locale: Locale }) {
  const { heading, items } = PAGES[locale].faq;
  return (
    <section className="mx-auto mt-10 max-w-3xl" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 px-1 text-lg font-extrabold text-ink">
        {heading}
      </h2>
      <div className="card divide-y divide-line overflow-hidden">
        {items.map((faq, index) => (
          <details
            key={faq.question}
            name="faq"
            open={index === 0}
            className="faq-item group"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-2">
              <h3 className="flex-1 text-sm font-semibold text-ink">
                {faq.question}
              </h3>
              <span
                aria-hidden="true"
                className="shrink-0 text-subtle transition-transform duration-300 group-open:rotate-45"
              >
                ＋
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
