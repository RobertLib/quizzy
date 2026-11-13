import type { BankQuestion } from "./types";
import { generalKnowledge } from "./general-knowledge";
import { science } from "./science";
import { history } from "./history";
import { geography } from "./geography";
import { literature } from "./literature";
import { mathematics } from "./mathematics";
import { sports } from "./sports";
import { entertainment } from "./entertainment";

export type { BankQuestion } from "./types";

/**
 * Every question we wrote ourselves, in a stable order: release batch first,
 * then id. The daily challenge shuffles this list with a fixed seed, so the
 * order must never depend on how the category files are arranged.
 */
export const questionBank: BankQuestion[] = [
  ...generalKnowledge,
  ...science,
  ...history,
  ...geography,
  ...literature,
  ...mathematics,
  ...sports,
  ...entertainment,
].sort((a, b) =>
  a.since === b.since
    ? a.id < b.id
      ? -1
      : a.id > b.id
        ? 1
        : 0
    : a.since < b.since
      ? -1
      : 1
);

export function questionsInCategory(category: string): BankQuestion[] {
  return questionBank.filter((q) => q.category === category);
}
