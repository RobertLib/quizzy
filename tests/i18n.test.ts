import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { questionBank } from "@/data/questions";
import { localizeQuestion, translationsFor } from "@/data/questions/localize";
import { CATEGORIES } from "@/data/categories";
import { CATEGORY_CONTENT } from "@/data/category-content";
import { LOCALES, czPlural } from "@/i18n/config";
import { localeOfPath, parsePath, pathFor, switchLocalePath, type Route } from "@/i18n/routes";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { UI } from "@/i18n/ui";

describe("question translations", () => {
  for (const locale of LOCALES.filter((l) => l !== "en")) {
    const translations = translationsFor(locale)!;

    it(`cover every bank question in ${locale}, and nothing else`, () => {
      const ids = new Set(questionBank.map((q) => q.id));
      const missing = [...ids].filter((id) => !(id in translations));
      const extra = Object.keys(translations).filter((id) => !ids.has(id));
      assert.deepEqual(missing, [], "untranslated questions");
      assert.deepEqual(extra, [], "translations for questions that don't exist");
    });

    it(`keep the shape of every question in ${locale}`, () => {
      for (const q of questionBank) {
        const t = translations[q.id];
        assert.ok(t.question.trim(), `${q.id}: empty question`);
        assert.equal(
          t.explanation !== undefined,
          q.explanation !== undefined,
          `${q.id}: explanation present in only one language`
        );
        if (q.type === "boolean") {
          assert.equal(t.correct_answer, undefined, `${q.id}: true/false answers are not translated`);
          assert.equal(t.incorrect_answers, undefined, `${q.id}: true/false answers are not translated`);
        } else {
          assert.ok(t.correct_answer?.trim(), `${q.id}: missing correct answer`);
          assert.equal(
            t.incorrect_answers?.length,
            q.incorrect_answers.length,
            `${q.id}: wrong number of incorrect answers`
          );
          const options = [t.correct_answer, ...t.incorrect_answers!].map((o) => o!.trim());
          assert.equal(new Set(options).size, options.length, `${q.id}: duplicate options`);
        }
      }
    });

    it(`change only the text in ${locale}`, () => {
      for (const q of questionBank) {
        const l = localizeQuestion(q, locale);
        assert.equal(l.id, q.id);
        assert.equal(l.since, q.since);
        assert.equal(l.category, q.category);
        assert.equal(l.difficulty, q.difficulty);
        assert.equal(l.type, q.type);
        if (q.type === "boolean") assert.equal(l.correct_answer, q.correct_answer);
      }
    });
  }
});

describe("routes", () => {
  const routes: Route[] = [
    { page: "home" },
    { page: "topics" },
    ...CATEGORIES.map((category) => ({ page: "topic" as const, category })),
    { page: "daily" },
    { page: "day", date: "2026-11-13" },
    { page: "challenge", date: "2026-11-13", result: "gggrgggg-700" },
    { page: "embed" },
  ];

  it("keeps the English paths the site has always had", () => {
    assert.equal(pathFor({ page: "home" }, "en"), "/");
    assert.equal(pathFor({ page: "topics" }, "en"), "/trivia");
    assert.equal(pathFor({ page: "topic", category: CATEGORIES[1] }, "en"), "/trivia/science");
    assert.equal(pathFor({ page: "daily" }, "en"), "/daily");
    assert.equal(pathFor({ page: "day", date: "2026-11-13" }, "en"), "/daily/2026-11-13");
    assert.equal(
      pathFor({ page: "challenge", date: "2026-11-13", result: "gggrgggg-700" }, "en"),
      "/c/2026-11-13/gggrgggg-700"
    );
    assert.equal(pathFor({ page: "embed" }, "en"), "/embed/daily");
  });

  it("puts Czech under /cs with Czech slugs", () => {
    assert.equal(pathFor({ page: "home" }, "cs"), "/cs");
    assert.equal(pathFor({ page: "topic", category: CATEGORIES[3] }, "cs"), "/cs/kvizy/zemepis");
    assert.equal(pathFor({ page: "day", date: "2026-11-13" }, "cs"), "/cs/denni/2026-11-13");
    assert.equal(pathFor({ page: "embed" }, "cs"), "/cs/embed/denni");
  });

  it("parses every path back to its route", () => {
    for (const locale of LOCALES) {
      for (const route of routes) {
        const path = pathFor(route, locale);
        assert.deepEqual(parsePath(path), { locale, route }, path);
        assert.equal(localeOfPath(path), locale, path);
      }
    }
  });

  it("switches language on the same page", () => {
    assert.equal(switchLocalePath("/trivia/science", "cs"), "/cs/kvizy/veda");
    assert.equal(switchLocalePath("/cs/kvizy/veda", "en"), "/trivia/science");
    assert.equal(switchLocalePath("/cs/vyzva/2026-11-13/gggrgggg-700", "en"), "/c/2026-11-13/gggrgggg-700");
    assert.equal(switchLocalePath("/cs/", "en"), "/");
    // Unknown pages fall back to the other language's home page.
    assert.equal(switchLocalePath("/nope", "cs"), "/cs");
    assert.equal(switchLocalePath("/trivia/nope", "cs"), "/cs");
  });

  it("doesn't mistake an English path that starts with 'cs' for Czech", () => {
    assert.equal(localeOfPath("/csv"), "en");
  });

  it("gives every category a distinct slug per language", () => {
    for (const locale of LOCALES) {
      const slugs = CATEGORIES.map((c) => c.slug[locale]);
      assert.equal(new Set(slugs).size, slugs.length);
    }
  });
});

describe("page text", () => {
  it("has copy for every category in every language", () => {
    for (const locale of LOCALES) {
      for (const category of CATEGORIES) {
        const content = CATEGORY_CONTENT[locale][category.name];
        assert.ok(content?.quiz && content.tagline && content.intro.length > 0, `${locale} ${category.name}`);
      }
    }
  });

  it("names every badge in every language", () => {
    for (const locale of LOCALES) {
      for (const achievement of ACHIEVEMENTS) {
        assert.ok(UI[locale].achievements[achievement.id]?.name, `${locale} ${achievement.id}`);
      }
    }
  });

  it("uses Czech plural forms", () => {
    const form = (n: number) => czPlural(n, "otázka", "otázky", "otázek");
    assert.deepEqual([0, 1, 2, 4, 5, 8, 21].map(form), [
      "otázek",
      "otázka",
      "otázky",
      "otázky",
      "otázek",
      "otázek",
      "otázek",
    ]);
  });
});
