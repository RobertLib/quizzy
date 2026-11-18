"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/i18n/config";
import { UI, type UiMessages } from "@/i18n/ui";

const LocaleContext = createContext<Locale>("en");

/** Set once per root layout: a page's language never changes on the client. */
export default function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** The UI text for the page's language. */
export function useUi(): UiMessages {
  return UI[useContext(LocaleContext)];
}
