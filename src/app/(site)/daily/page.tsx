import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import DailyCard from "@/components/DailyCard";
import EmbedCode from "@/components/EmbedCode";
import { archiveKeys, dailyNumber, formatDateKey } from "@/lib/daily";
import { pageMetadata } from "@/lib/site";

// The archive grows by a day at a time.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Daily Trivia Challenge — 8 New Questions Every Day",
  description:
    "A free daily trivia quiz: eight new questions every day, the same for everyone. Keep your streak, see how you did against other players, challenge friends and browse past dailies with answers.",
  path: "/daily",
});

export default function DailyPage() {
  const archive = archiveKeys();

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs items={[{ name: "Daily challenge", path: "/daily" }]} />

      <h1 className="text-balance text-3xl font-extrabold tracking-tight text-ink">
        Daily trivia challenge
      </h1>
      <p className="mb-6 mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
        Eight new questions every day, the same for everyone, refreshed at
        midnight your time. Play once, keep your streak alive, see how you did
        against everyone else — then send the same eight to a friend.
      </p>

      <DailyCard showArchiveLink={false} />

      <section className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="How it works">
        {[
          ["⏱️", "Timed", "A countdown on every question, with bonus points for speed."],
          ["⚔️", "Challenge friends", "Share your result — the link gives them your exact eight questions."],
          ["💡", "Learn something", "Every answer comes with a one-line explanation."],
        ].map(([emoji, title, text]) => (
          <div key={title} className="card p-4">
            <div className="text-xl">{emoji}</div>
            <h2 className="mt-1 text-sm font-bold text-ink">{title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section id="archive" className="mt-10 scroll-mt-20" aria-labelledby="archive-heading">
        <h2 id="archive-heading" className="mb-1 text-xl font-extrabold text-ink">
          Past daily quizzes with answers
        </h2>
        <p className="mb-4 text-sm text-muted">
          Missed a day? Every daily stays playable here — answers are published
          two days later, once it&apos;s over everywhere in the world.
        </p>
        {archive.length === 0 ? (
          <p className="card p-5 text-sm text-muted">The first archived daily appears soon.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {archive.map((key) => (
              <li key={key}>
                <Link
                  href={`/daily/${key}`}
                  className="card flex items-center justify-between gap-3 px-4 py-3 transition hover:border-brand/40 hover:shadow-lift"
                >
                  <span className="text-sm font-bold text-ink">Daily #{dailyNumber(key)}</span>
                  <span className="text-xs text-subtle">{formatDateKey(key)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="embed" className="card mt-10 scroll-mt-20 p-5 sm:p-6" aria-labelledby="embed-heading">
        <h2 id="embed-heading" className="text-lg font-extrabold text-ink">
          Put the daily quiz on your website
        </h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Free for blogs, school pages, newsletters and community sites. It
          updates itself every day — paste this where you want it to appear.
        </p>
        <EmbedCode />
      </section>
    </div>
  );
}
