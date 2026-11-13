# Quizzy

A free trivia game built with Next.js: a daily challenge that's the same for
everyone, custom rounds across eight topics, streaks, levels and badges.
Progress lives in the browser — there are no accounts.

## Development

```bash
npm install
npm run dev
```

## Configuration

All optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for canonicals, the sitemap and share links. Defaults to `https://quizzy-eight-khaki.vercel.app`; set it when the site moves to its own domain. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis (Vercel Marketplace → Upstash). Enables "better than X% of players" and per-question stats for the daily. `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` work too. Without them the stats are simply hidden. |

## Question bank

Our own questions live in `src/data/questions/`, one file per category. The
daily challenge, the topic pages and the daily archive are built from them;
custom rounds also pull from the Open Trivia Database. See
`src/data/questions/batches.ts` before adding or removing questions — the
rules there keep past dailies unchanged.
