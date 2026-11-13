/**
 * Release dates for the question bank. Rules that keep past dailies stable:
 * - Never delete a question or change its `id` or `since` — the daily order
 *   is a seeded shuffle of the bank sorted by (since, id).
 * - New questions go in a new batch dated on or after the deploy day.
 * - Fixing a question's wording or answers is fine; it just changes that
 *   question wherever it appeared in the archive.
 */

/** The original bundled bank. */
export const LEGACY = "2025-07-12";

/**
 * Second batch (explanations + new questions). Must be on or after the day it
 * is deployed — otherwise the dailies between this date and the deploy would
 * change after people had already played them.
 */
export const BATCH_2 = "2026-11-16";
