import QuizHost from "./QuizHost";
import Footer from "./Footer";
import type { Locale } from "@/i18n/config";

/** Header, page and footer for every regular page of one language. */
export default function SiteShell({
  locale,
  children,
}: Readonly<{ locale: Locale; children: React.ReactNode }>) {
  return (
    <QuizHost>
      {children}
      <Footer locale={locale} />
    </QuizHost>
  );
}
