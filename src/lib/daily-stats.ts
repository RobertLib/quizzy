/** How everyone did on one daily. Shared by the API route and the client. */
export interface DailyStats {
  plays: number;
  /** histogram[n] = players who got exactly n right. */
  histogram: number[];
  /** perQuestion[i] = players who got question i right. */
  perQuestion: number[];
}

/** Below this, percentages say more about noise than about the question. */
export const MIN_PLAYS_FOR_STATS = 5;

/** Share of players who got strictly fewer right, as a whole percentage. */
export function betterThan(stats: DailyStats, correct: number): number {
  if (stats.plays === 0) return 0;
  const below = stats.histogram.slice(0, correct).reduce((a, b) => a + b, 0);
  return Math.round((below / stats.plays) * 100);
}

export function averageCorrect(stats: DailyStats): number {
  if (stats.plays === 0) return 0;
  const total = stats.histogram.reduce((sum, count, n) => sum + count * n, 0);
  return total / stats.plays;
}

export function percentRight(stats: DailyStats, index: number): number {
  if (stats.plays === 0) return 0;
  return Math.round(((stats.perQuestion[index] ?? 0) / stats.plays) * 100);
}
