import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

const Footer = () => (
  <footer className="mx-auto mt-12 max-w-3xl px-1 pb-4">
    <div className="border-t border-line pt-6">
      <nav
        aria-label="Footer"
        className="mb-6 grid gap-6 text-sm sm:grid-cols-[1fr_2fr]"
      >
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">
            Play
          </h2>
          <ul className="space-y-1.5">
            <li>
              <Link href="/" className="text-muted hover:text-ink">
                Trivia quiz
              </Link>
            </li>
            <li>
              <Link href="/daily" className="text-muted hover:text-ink">
                Daily trivia challenge
              </Link>
            </li>
            <li>
              <Link href="/daily#archive" className="text-muted hover:text-ink">
                Daily archive with answers
              </Link>
            </li>
            <li>
              <Link href="/daily#embed" className="text-muted hover:text-ink">
                Embed the daily quiz
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-subtle">
            <Link href="/trivia" className="hover:text-ink">
              Trivia by topic
            </Link>
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/trivia/${category.slug}`}
                  className="text-muted hover:text-ink"
                >
                  {category.name} quiz
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
          <span className="brand-gradient-text text-base font-extrabold">
            Quizzy
          </span>
        </div>
        <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
          A free, no-account trivia game across eight categories and three
          difficulty levels, with a new daily challenge every day.
        </p>
        <p className="mt-4 text-xs text-subtle">
          © {new Date().getFullYear()} Quizzy · Built by Robert Libsansky
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
