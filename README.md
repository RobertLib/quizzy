# Quizzy

A free trivia game built with Next.js: a daily challenge that's the same for
everyone, custom rounds across eight topics, streaks, levels and badges.
Progress lives in the browser — there are no accounts.

## Languages

The site is in English (at the root: `/daily`, `/trivia/science`) and Czech
(under `/cs` with Czech slugs: `/cs/denni`, `/cs/kvizy/veda`). Each language
has its own root layout — `src/app/(en)` and `src/app/(cs)/cs` — and their
route files are thin wrappers around the shared pages in `src/screens/`.

- `src/i18n/routes.ts` maps every page to its path in each language; the
  language switcher and hreflang links are built from it.
- `src/i18n/messages/ui.*.ts` holds the text of interactive components,
  `pages.*.ts` the server-rendered copy (headings, FAQ, metadata). The Czech
  files are typed against the English ones, so a missing key won't compile.
- Question translations live in `src/data/questions/cs/`, keyed by question
  id. Ids, categories and release dates are shared, so the daily is the same
  set of questions in both languages and challenge links work across them.
  Czech custom rounds use only our own bank — Open Trivia DB is English-only.

## Development

```bash
npm install
npm run dev
npm test   # Node's built-in test runner — no extra dependencies
```

## Configuration

All optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for canonicals, the sitemap and share links. Defaults to `https://quizzy-eight-khaki.vercel.app`; set it when the site moves to its own domain. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (Vercel Marketplace → Upstash). Enables "better than X% of players" and per-question stats for the daily. `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` work too. Without them the stats are simply hidden. |

## Question bank

Our own questions live in `src/data/questions/`, one file per category, with
their Czech translations in `src/data/questions/cs/`. The
daily challenge, the topic pages and the daily archive are built from them;
custom rounds also pull from the Open Trivia Database. See
`src/data/questions/batches.ts` before adding or removing questions — the
rules there keep past dailies unchanged.
