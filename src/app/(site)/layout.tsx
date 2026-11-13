import QuizHost from "@/components/QuizHost";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QuizHost>
      {children}
      <Footer />
    </QuizHost>
  );
}
