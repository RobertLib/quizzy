import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { categoryContent } from "@/data/category-content";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import { PAGES } from "@/i18n/pages";
import CurrentYear from "./ui/CurrentYear";
import LanguageSwitch from "./LanguageSwitch";

const Footer = ({ locale }: { locale: Locale }) => {
  const t = PAGES[locale].footer;
  const daily = pathFor({ page: "daily" }, locale);
  return (
    <footer className="mx-auto mt-12 max-w-3xl px-1 pb-4">
      <div className="border-t border-line pt-6">
        <nav aria-label={t.label} className="mb-6 grid gap-6 text-sm sm:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">{t.play}</h2>
            <ul className="space-y-1.5">
              <li>
                <Link href={pathFor({ page: "home" }, locale)} className="text-muted hover:text-ink">
                  {t.triviaQuiz}
                </Link>
              </li>
              <li>
                <Link href={daily} className="text-muted hover:text-ink">
                  {t.dailyChallenge}
                </Link>
              </li>
              <li>
                <Link href={`${daily}#archive`} className="text-muted hover:text-ink">
                  {t.archive}
                </Link>
              </li>
              <li>
                <Link href={`${daily}#embed`} className="text-muted hover:text-ink">
                  {t.embed}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">
              <Link href={pathFor({ page: "topics" }, locale)} className="hover:text-ink">
                {t.byTopic}
              </Link>
            </h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {CATEGORIES.map((category) => (
                <li key={category.name}>
                  <Link
                    href={pathFor({ page: "topic", category }, locale)}
                    className="text-muted hover:text-ink"
                  >
                    {categoryContent(category.name, locale).quiz}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-brand to-streak text-sm">
              🧠
            </span>
            <span className="brand-gradient-text text-base font-extrabold">Quizzy</span>
          </div>
          <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">{t.blurb}</p>
          <nav aria-label={t.language} className="mt-4 text-xs">
            <LanguageSwitch variant="footer" />
          </nav>
          <p className="mt-3 text-xs text-subtle">
            © <CurrentYear fallback={new Date().getFullYear()} /> Quizzy · {t.builtBy}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
