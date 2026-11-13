/**
 * Release dates for the question bank. Rules that keep past dailies stable
 * (see createDailySchedule in src/lib/daily-questions.ts):
 * - Never delete a question or change its `id`, `since` or `category` — the
 *   daily schedule is built from them, and every day after the question's
 *   release would change.
 * - New questions go in a new batch dated at least two days after the deploy.
 *   A day's set can be fetched a day early (it is already "today" in UTC+14),
 *   so a batch dated the day after a deploy could still rewrite a played day.
 * - Fixing a question's wording, answers, explanation or difficulty is fine;
 *   it just changes that question wherever it appeared in the archive.
 */

/** The original bundled bank. */
export const LEGACY = "2025-07-12";

/** Second batch (explanations + new questions). */
export const BATCH_2 = "2026-11-16";
