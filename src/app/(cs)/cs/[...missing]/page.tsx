import { notFound } from "next/navigation";

/**
 * Any path no other route matches. With one root layout per language there
 * is no app-wide not-found page, so each language catches its own unknown
 * paths and shows its own 404 inside its own layout.
 */
export default function Missing() {
  notFound();
}
