const FAQS = [
  {
    question: "How does scoring work?",
    answer:
      "Every correct answer is worth 100 base points. In timed mode you also earn up to 100 bonus points for answering quickly. Harder questions multiply the total (×1.25 medium, ×1.5 hard), and three correct answers in a row starts a streak multiplier that climbs to ×3.",
  },
  {
    question: "What is the Daily Challenge?",
    answer:
      "Eight questions, the same set for everyone, refreshed at midnight your time. You get one go: once you start, today's daily counts as played, and replays are practice. Play it every day to build a daily streak — miss a day and the streak resets to zero. After you finish you'll see how you did against everyone else, and past days stay playable in the daily archive.",
  },
  {
    question: "How do I challenge a friend?",
    answer:
      "Finish the Daily Challenge and tap Share. The link opens the same eight questions for your friend and shows them your score to beat — when they finish, both results appear side by side.",
  },
  {
    question: "What are the power-ups for?",
    answer:
      "You get one of each per quiz. 50:50 removes wrong answers, +10s buys time in timed mode, and Skip passes a question without breaking your streak. Finishing a timed quiz at 90%+ without touching them unlocks the Purist badge.",
  },
  {
    question: "Can I play with the keyboard?",
    answer:
      "Yes. Press A–D (or 1–4) to pick an answer, then Enter or Space to move to the next question. Correct answers advance on their own after a beat unless there's an explanation to read.",
  },
  {
    question: "Where is my progress stored?",
    answer:
      "In your browser — no account, no sign-up. Your level, XP, badges, streaks and category stats live on this device, and you can wipe them any time from the settings menu. Two things are sent to us, neither tied to you: your Daily Challenge result (which of the eight you got right), so everyone can see how the day went, and cookie-free usage counts (page views, rounds started and finished, shares) through Vercel Analytics.",
  },
  {
    question: "Where do the questions come from?",
    answer:
      "The Daily Challenge and the topic pages use Quizzy's own question bank, with a short explanation for every answer. Custom rounds also pull from the Open Trivia Database for extra variety.",
  },
  {
    question: "Can I put the daily quiz on my own website?",
    answer:
      "Yes — the daily archive page has a copy-and-paste embed code. It's free; just keep the credit link.",
  },
  {
    question: "Is Quizzy free?",
    answer:
      "Completely. No ads, no accounts, no limits on how many rounds you play.",
  },
];

/**
 * Native <details> keeps every answer in the HTML (search engines read it)
 * while still collapsing them; `name` makes it a one-open-at-a-time accordion.
 */
export default function FAQ() {
  return (
    <section className="mx-auto mt-10 max-w-3xl" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="mb-4 px-1 text-lg font-extrabold text-ink">
        Frequently asked
      </h2>
      <div className="card divide-y divide-line overflow-hidden">
        {FAQS.map((faq, index) => (
          <details
            key={faq.question}
            name="faq"
            open={index === 0}
            className="faq-item group"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-2">
              <h3 className="flex-1 text-sm font-semibold text-ink">
                {faq.question}
              </h3>
              <span
                aria-hidden="true"
                className="shrink-0 text-subtle transition-transform duration-300 group-open:rotate-45"
              >
                ＋
              </span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
