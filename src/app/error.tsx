"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="app-shell grid min-h-screen place-items-center px-4">
      <div className="card relative z-10 max-w-sm p-8 text-center">
        <div className="mb-3 text-4xl">🫠</div>
        <h2 className="mb-2 text-lg font-extrabold text-ink">
          That round went sideways
        </h2>
        <p className="mb-6 text-sm text-muted">
          {error.message || "Something went wrong on our end."}
        </p>
        <button
          onClick={reset}
          className="w-full rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
