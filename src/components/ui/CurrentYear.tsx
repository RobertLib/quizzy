"use client";

import { useHydrated } from "@/lib/client-state";

/**
 * The current year. Static pages are rendered at build time, so the server's
 * year (`fallback`) is shown until hydration and then replaced by the
 * browser's — without a hydration mismatch after New Year.
 */
export default function CurrentYear({ fallback }: { fallback: number }) {
  const hydrated = useHydrated();
  return <>{hydrated ? new Date().getFullYear() : fallback}</>;
}
