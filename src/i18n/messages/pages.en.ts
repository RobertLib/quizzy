import { formatNumber } from "../config";
import type { Difficulty } from "@/types/quiz";

const n = (value: number) => formatNumber(value, "en");

const LEVEL: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

/** A topic as page copy needs it: its label and its quiz's name. */
export interface TopicNames {
  label: string;
  quiz: string;
}

/**
 * Text for server-rendered pages: headings, intros, FAQ and metadata. Only
 * server components import it, so none of it ships to the browser.
 */
export const pagesEn = {
  meta: {
    homeTitle: "Quizzy — Free Daily Trivia Quiz with Answers",
    homeDescription:
      "A free trivia quiz with a new daily challenge: beat the clock, build streaks for up to ×3 points, unlock badges and challenge friends. Eight categories, three difficulties, no sign-up.",
    ogAlt: "Quizzy — free daily trivia quiz",
    appDescription:
      "Free trivia game with a daily challenge, timed rounds, streak multipliers, levels and badges",
    topicsTitle: "Trivia Questions by Topic — Free Quizzes with Answers",
    topicsDescription:
      "Free trivia quizzes in eight topics — general knowledge, science, history, geography, literature, maths, sports and entertainment. Play a timed round or browse every question with its answer.",
    topicTitle: (topic: TopicNames, count: number) =>
      `${topic.label} Trivia Quiz — ${count} Questions with Answers`,
    topicDescription: (topic: TopicNames, tagline: string, count: number) =>
      `Free ${topic.label.toLowerCase()} trivia quiz: ${tagline} Play a timed round or browse ${count} questions with answers and explanations.`,
    dailyTitle: "Daily Trivia Challenge — 8 New Questions Every Day",
    dailyDescription:
      "A free daily trivia quiz: eight new questions every day, the same for everyone. Keep your streak, see how you did against other players, challenge friends and browse past dailies with answers.",
    dayTitleRevealed: (number: number, day: string) =>
      `Daily Trivia #${number} (${day}) — Questions & Answers`,
    dayDescriptionRevealed: (count: number, day: string) =>
      `The ${count} questions from Quizzy's daily trivia challenge on ${day}, with answers and explanations. Play the set yourself or check how you'd have done.`,
    dayTitle: (number: number, day: string) => `Daily Trivia #${number} — ${day}`,
    dayDescription: (count: number, day: string) =>
      `Quizzy's daily trivia challenge for ${day}: ${count} questions, the same for everyone.`,
    challengeTitle: (correct: number, count: number, number: number) =>
      `Can you beat ${correct}/${count} on Quizzy Daily #${number}?`,
    challengeDescription: (correct: number, count: number, points: number, day: string) =>
      `A friend scored ${correct}/${count} (${n(points)} pts) on the daily trivia challenge for ${day}. Same ${count} questions — your turn.`,
    embedTitle: "Daily trivia",
  },
  breadcrumbs: { label: "Breadcrumb", home: "Home" },
  home: {
    eyebrow: "Free daily trivia quiz",
    titleBefore: "How much do you ",
    titleEmphasis: "actually",
    titleAfter: " know?",
    lead: "Beat the clock, build a streak, climb the levels — then dare a friend to beat today's score.",
    topicsHeading: "Trivia by topic",
    allTopics: "All topics →",
    topicCardSub: "Questions & answers",
    features: [
      {
        emoji: "🔥",
        title: "Streaks that pay",
        text: "Three right in a row starts a multiplier — up to ×3 on every point you bank.",
      },
      {
        emoji: "⚔️",
        title: "Challenge a friend",
        text: "Share your daily result and your friend gets the same eight questions — with your score to beat.",
      },
      {
        emoji: "💡",
        title: "Learn as you go",
        text: "Daily questions come with a short explanation, so even a wrong answer teaches you something.",
      },
    ],
  },
  faq: {
    heading: "Frequently asked",
    items: [
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
        answer: "Completely. No ads, no accounts, no limits on how many rounds you play.",
      },
    ],
  },
  topics: {
    crumb: "Topics",
    title: "Trivia questions by topic",
    lead: "Pick a topic to play a quick timed round, or browse its full list of questions with answers and explanations — free to use for your own quiz night.",
    cardTitle: (topic: TopicNames) => `${topic.label} trivia`,
    count: (count: number) => `${count} questions with answers →`,
  },
  topic: {
    title: (topic: TopicNames) => `${topic.label} trivia quiz`,
    questionsHeading: (topic: TopicNames, count: number) =>
      `${count} ${topic.label.toLowerCase()} trivia questions and answers`,
    hint: "Tap “Show answer” to check yourself. Hosting a quiz? You're welcome to use these.",
    levelHeading: (topic: TopicNames, level: Difficulty) =>
      `${LEVEL[level]} ${topic.label.toLowerCase()} questions`,
    moreTopics: "More trivia topics",
    dailyLink: "📅 Daily challenge",
  },
  questionList: {
    showAnswer: "Show answer",
    answer: "Answer:",
  },
  daily: {
    crumb: "Daily challenge",
    title: "Daily trivia challenge",
    lead: "Eight new questions every day, the same for everyone, refreshed at midnight your time. Play once, keep your streak alive, see how you did against everyone else — then send the same eight to a friend.",
    howItWorks: "How it works",
    features: [
      { emoji: "⏱️", title: "Timed", text: "A countdown on every question, with bonus points for speed." },
      {
        emoji: "⚔️",
        title: "Challenge friends",
        text: "Share your result — the link gives them your exact eight questions.",
      },
      { emoji: "💡", title: "Learn something", text: "Every answer comes with a one-line explanation." },
    ],
    archiveHeading: "Past daily quizzes with answers",
    archiveLead:
      "Missed a day? Every daily stays playable here — answers are published two days later, once it's over everywhere in the world.",
    archiveEmpty: "The first archived daily appears soon.",
    archiveItem: (number: number) => `Daily #${number}`,
    embedHeading: "Put the daily quiz on your website",
    embedLead:
      "Free for blogs, school pages, newsletters and community sites. It updates itself every day — paste this where you want it to appear.",
  },
  day: {
    title: (number: number) => `Daily trivia #${number}`,
    leadRevealed: (count: number, day: string) =>
      `The ${count} questions everyone played on ${day}. Play them yourself first — the answers are below.`,
    lead: (count: number) =>
      `${count} questions, the same for everyone. The answers go up here once the day is over everywhere.`,
    answersHeading: "Questions and answers",
    locked: (day: string) => `🔒 Answers for this day are published on ${day}.`,
    otherDays: "Other days",
    allDailies: "All dailies",
  },
  challenge: {
    eyebrow: "⚔️ You've been challenged",
    title: (correct: number, count: number) => `Can you beat ${correct}/${count}?`,
    scored: (points: number, number: number, day: string) =>
      `A friend scored ${n(points)} points on Daily #${number} (${day}).`,
    footnote: (count: number) => `Same ${count} questions, timed. Free, no sign-up.`,
    newHere: "New to Quizzy?",
    seeMore: "See what else you can play →",
    imageAlt: "A friend's Quizzy daily trivia score — can you beat it?",
    imageHeading: (number: number) => `Quizzy Daily #${number}`,
    imageFallbackHeading: "Quizzy Daily",
    imageFallbackScore: "Daily trivia",
    imagePoints: (points: number) => `${n(points)} pts — can you beat it?`,
    imageFallback: (count: number) => `${count} questions. Same for everyone.`,
  },
  embedPage: {
    credit: "Daily trivia by Quizzy ↗",
  },
  notFound: {
    title: "That question isn't in the bank",
    text: "The page you're after doesn't exist — but there's plenty else to play.",
    play: "Play a quiz",
    daily: "Today's daily challenge",
  },
  footer: {
    label: "Footer",
    play: "Play",
    triviaQuiz: "Trivia quiz",
    dailyChallenge: "Daily trivia challenge",
    archive: "Daily archive with answers",
    embed: "Embed the daily quiz",
    byTopic: "Trivia by topic",
    blurb:
      "A free, no-account trivia game across eight categories and three difficulty levels, with a new daily challenge every day.",
    builtBy: "Built by Robert Libsansky",
    language: "Language",
  },
};

export type PageMessages = typeof pagesEn;
