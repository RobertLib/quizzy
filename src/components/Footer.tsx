const Footer = () => (
  <footer className="mx-auto mt-12 max-w-3xl px-1 pb-4">
    <div className="border-t border-line pt-6 text-center">
      <div className="mb-2 flex items-center justify-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-linear-to-br from-brand to-streak text-sm">
          🧠
        </span>
        <span className="brand-gradient-text text-base font-extrabold">
          Quizzy
        </span>
      </div>
      <p className="mx-auto max-w-md text-xs leading-relaxed text-muted">
        A no-account trivia game across eight categories and three difficulty
        levels. Questions from the Open Trivia Database.
      </p>
      <p className="mt-4 text-xs text-subtle">
        © {new Date().getFullYear()} Quizzy · Built by Robert Libsansky
      </p>
    </div>
  </footer>
);

export default Footer;
