"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  /** Whatever was thrown — not necessarily an Error. */
  error: unknown;
  retry: () => void;
}

/**
 * Error messages are for developers, not players: production hides server
 * errors behind a generic message anyway, and a client error's message can be
 * anything. The digest is what matches the server logs.
 */
export default function Error({ error, retry }: ErrorPageProps) {
  const digest =
    error instanceof globalThis.Error && "digest" in error && typeof error.digest === "string"
      ? error.digest
      : null;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="app-shell grid min-h-screen place-items-center px-4">
      <div className="card relative z-10 max-w-sm p-8 text-center">
        <div className="mb-3 text-4xl">🫠</div>
        <h2 className="mb-2 text-lg font-extrabold text-ink">
          That round went sideways
        </h2>
        <p className="mb-6 text-sm text-muted">
          Something went wrong on our end. Your progress is safe — it&apos;s
          stored on this device.
        </p>
        <button
          onClick={() => retry()}
          className="w-full rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-brand-contrast shadow-lift transition hover:bg-brand-strong"
        >
          Try again
        </button>
        {digest && <p className="mt-4 text-[0.7rem] text-subtle">Error {digest}</p>}
      </div>
    </div>
  );
}
