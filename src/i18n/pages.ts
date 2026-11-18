import type { Locale } from "./config";
import { pagesEn, type PageMessages, type TopicNames } from "./messages/pages.en";
import { pagesCs } from "./messages/pages.cs";

export type { PageMessages, TopicNames };

/** Page text for server components. Not imported by any client component. */
export const PAGES: Record<Locale, PageMessages> = { en: pagesEn, cs: pagesCs };
