import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app-shell grid min-h-screen place-items-center px-4">
      <div className="card relative z-10 max-w-sm p-8 text-center">
        <div className="mb-3 text-4xl">🧭</div>
        <h1 className="mb-2 text-lg font-extrabold text-ink">
          That question isn&apos;t in the bank
        </h1>
        <p className="mb-6 text-sm text-muted">
          The page you&apos;re after doesn&apos;t exist — but there&apos;s plenty
          else to play.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong"
          >
            Play a quiz
          </Link>
          <Link
            href="/daily"
            className="rounded-2xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-muted transition hover:text-ink"
          >
            Today&apos;s daily challenge
          </Link>
        </div>
      </div>
    </div>
  );
}
