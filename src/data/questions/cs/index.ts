import type { QuestionTranslations } from "../types";
import { generalKnowledge } from "./general-knowledge";
import { science } from "./science";
import { history } from "./history";
import { geography } from "./geography";
import { literature } from "./literature";
import { mathematics } from "./mathematics";
import { sports } from "./sports";
import { entertainment } from "./entertainment";

/** Czech text for every bank question, keyed by question id. */
export const cs: QuestionTranslations = {
  ...generalKnowledge,
  ...science,
  ...history,
  ...geography,
  ...literature,
  ...mathematics,
  ...sports,
  ...entertainment,
};
