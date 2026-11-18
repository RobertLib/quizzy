import type { Locale } from "./config";
import { uiEn, type UiMessages } from "./messages/ui.en";
import { uiCs } from "./messages/ui.cs";

export type { UiMessages };

/** UI text for client components. Small enough to ship every language. */
export const UI: Record<Locale, UiMessages> = { en: uiEn, cs: uiCs };

/** "True"/"False" are stored as-is in questions; this is what the player sees. */
export function answerLabel(answer: string, type: "multiple" | "boolean", ui: UiMessages): string {
  if (type !== "boolean") return answer;
  if (answer === "True") return ui.common.answerTrue;
  if (answer === "False") return ui.common.answerFalse;
  return answer;
}
