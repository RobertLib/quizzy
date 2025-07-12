"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "How does scoring work?",
    answer:
      "Every correct answer is worth 100 base points. In timed mode you also earn up to 100 bonus points for answering quickly. Harder questions multiply the total (×1.25 medium, ×1.5 hard), and three correct answers in a row starts a streak multiplier that climbs to ×3.",
  },
  {
    question: "What is the Daily Challenge?",
    answer:
      "Eight questions, the same set for everyone, refreshed at midnight your time. Play it every day to build a daily streak — miss a day and the streak resets to zero.",
  },
  {
    question: "What are the power-ups for?",
    answer:
      "You get one of each per quiz. 50:50 removes wrong answers, +10s buys time in timed mode, and Skip passes a question without breaking your streak. Finishing a timed quiz at 90%+ without touching them unlocks the Purist badge.",
  },
  {
    question: "Can I play with the keyboard?",
    answer:
      "Yes. Press A–D (or 1–4) to pick an answer, then Enter or Space to move to the next question. Correct answers advance on their own after a beat.",
  },
  {
    question: "Where is my progress stored?",
    answer:
      "Entirely in your browser — no account, no sign-up, nothing sent anywhere. Your level, XP, badges, streaks and category stats live on this device, and you can wipe them any time from the settings menu.",
  },
  {
    question: "Where do the questions come from?",
    answer:
      "Live questions come from the Open Trivia Database across eight categories. If it is unreachable, Quizzy falls back to a bundled question bank so a round always works — even offline.",
  },
  {
    question: "Is Quizzy free?",
    answer:
      "Completely. No ads, no accounts, no limits on how many rounds you play.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto mt-10 max-w-3xl">
      <h2 className="mb-4 px-1 text-lg font-extrabold text-ink">
        Frequently asked
      </h2>
      <div className="card divide-y divide-line overflow-hidden">
        {FAQS.map((faq, index) => {
          const isOpen = open === index;
          return (
            <div key={faq.question}>
              <button
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-2"
              >
                <h3 className="flex-1 text-sm font-semibold text-ink">
                  {faq.question}
                </h3>
                <span
                  className={`shrink-0 text-subtle transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  ＋
                </span>
              </button>
              {isOpen && (
                <p className="animate-rise px-5 pb-4 text-sm leading-relaxed text-muted">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
