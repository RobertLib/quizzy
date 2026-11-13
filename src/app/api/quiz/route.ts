import { NextRequest, NextResponse } from "next/server";
import type { QuizApiResponse, QuizQuestion, Difficulty } from "@/types/quiz";
import { shuffleArray } from "@/lib/quiz-api";
import { questionBank } from "@/data/questions";
import { unrevealedDailyIds } from "@/lib/daily-questions";

/** Our category labels mapped to Open Trivia DB category ids. */
const CATEGORY_TO_API_ID: Record<string, number> = {
  "General Knowledge": 9,
  Science: 17, // Science & Nature
  History: 23,
  Geography: 22,
  Literature: 10, // Entertainment: Books
  Mathematics: 19, // Science: Mathematics
  Sports: 21,
  Entertainment: 11, // Entertainment: Film
};

const MAX_AMOUNT = 50;
/** Open Trivia DB's own limit on `amount`. */
const UPSTREAM_MAX_AMOUNT = 50;
const REQUEST_TIMEOUT_MS = 4000;

/**
 * Open Trivia DB allows one request per IP every five seconds, and every
 * player reaches it through this server's IP. Waiting or retrying would cost
 * the player seconds for nothing, so a round that comes inside the window is
 * dealt from our own bank instead — which has explanations anyway.
 */
const UPSTREAM_INTERVAL_MS = 5000;
let upstreamFreeAt = 0;

function normalizeKey(question: string) {
  return question.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * The upstream has ~24 categories ("Science: Computers", "Entertainment:
 * Video Games", …). Folding them into our eight keeps the player's category
 * stats readable and matches the chips they picked from.
 */
function toOurCategory(raw: string): string {
  if (raw in CATEGORY_TO_API_ID) return raw;
  if (raw === "Entertainment: Books") return "Literature";
  if (raw === "Science: Mathematics") return "Mathematics";
  if (raw.startsWith("Entertainment") || raw === "Art" || raw === "Celebrities")
    return "Entertainment";
  if (raw.startsWith("Science") || raw === "Animals") return "Science";
  if (raw === "Mythology") return "History";
  return "General Knowledge";
}

async function fetchOpenTdb(
  amount: number,
  difficulty: Difficulty | null,
  categoryId: number | null
): Promise<QuizQuestion[]> {
  const params = new URLSearchParams({
    amount: String(amount),
    type: "multiple",
    encode: "url3986",
  });
  if (difficulty) params.set("difficulty", difficulty);
  if (categoryId) params.set("category", String(categoryId));

  const response = await fetch(`https://opentdb.com/api.php?${params}`, {
    headers: { "User-Agent": "Quizzy-App/2.0" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`upstream ${response.status}`);

  const data = (await response.json()) as {
    response_code: number;
    results?: QuizQuestion[];
  };
  if (data.response_code !== 0 || !data.results?.length) {
    throw new Error(`upstream response_code ${data.response_code}`);
  }

  return data.results.map((q) => ({
    ...q,
    question: decodeURIComponent(q.question),
    correct_answer: decodeURIComponent(q.correct_answer),
    incorrect_answers: q.incorrect_answers.map((a) => decodeURIComponent(a)),
    category: toOurCategory(decodeURIComponent(q.category)),
  }));
}

/**
 * At most one upstream request per round, and none inside the rate-limit
 * window. A multi-category round asks for one of its categories; the bank
 * fills in the rest.
 */
async function upstreamQuestions(
  amount: number,
  categories: string[],
  difficulty: Difficulty | null
): Promise<QuizQuestion[]> {
  const now = Date.now();
  if (now < upstreamFreeAt) return [];
  upstreamFreeAt = now + UPSTREAM_INTERVAL_MS;

  const category =
    categories.length > 0
      ? categories[Math.floor(Math.random() * categories.length)]
      : null;
  const wanted = Math.min(
    UPSTREAM_MAX_AMOUNT,
    Math.max(3, Math.ceil((amount / Math.max(1, categories.length)) * 1.4))
  );
  try {
    return await fetchOpenTdb(
      wanted,
      difficulty,
      category ? CATEGORY_TO_API_ID[category] : null
    );
  } catch {
    return [];
  }
}

/**
 * Our own questions for a round — never one from a daily whose answers are
 * still unpublished, or the round would give them away.
 */
function bankFor(categories: string[], difficulty: Difficulty | null) {
  const hidden = unrevealedDailyIds();
  const available = questionBank.filter((q) => !hidden.has(q.id));
  const inCategories =
    categories.length > 0
      ? available.filter((q) => categories.includes(q.category))
      : available;
  const pool = difficulty
    ? inCategories.filter((q) => q.difficulty === difficulty)
    : inCategories;
  // If a filter combination is too narrow, relax difficulty before giving up.
  if (pool.length > 0) return pool;
  return inCategories.length > 0 ? inCategories : available;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const amount = Math.max(
    1,
    Math.min(MAX_AMOUNT, parseInt(searchParams.get("amount") || "10", 10) || 10)
  );
  const difficultyParam = searchParams.get("difficulty");
  const difficulty =
    difficultyParam && ["easy", "medium", "hard"].includes(difficultyParam)
      ? (difficultyParam as Difficulty)
      : null;
  const categories = (searchParams.get("categories") || "")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c in CATEGORY_TO_API_ID);

  const collected: QuizQuestion[] = [];
  const seen = new Set<string>();
  for (const question of await upstreamQuestions(amount, categories, difficulty)) {
    const key = normalizeKey(question.question);
    if (seen.has(key)) continue;
    seen.add(key);
    collected.push(question);
  }

  const topUp = shuffleArray(bankFor(categories, difficulty)).filter(
    (q) => !seen.has(normalizeKey(q.question))
  );

  // Balance across categories *after* the top-up, otherwise whichever category
  // the upstream happened to answer would dominate the round. Upstream
  // questions are listed first, so they win inside each category.
  const questions = balanceByCategory(
    [...shuffleArray(collected), ...topUp],
    amount
  );

  const result: QuizApiResponse = {
    response_code: 0,
    results: shuffleArray(questions),
  };

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}

/** Round-robin across categories so every selected topic is represented. */
function balanceByCategory(
  questions: QuizQuestion[],
  amount: number
): QuizQuestion[] {
  const buckets = new Map<string, QuizQuestion[]>();
  for (const question of questions) {
    const bucket = buckets.get(question.category) ?? [];
    bucket.push(question);
    buckets.set(question.category, bucket);
  }

  const out: QuizQuestion[] = [];
  const lists = [...buckets.values()];
  let index = 0;
  while (out.length < amount && lists.some((l) => l.length > 0)) {
    const list = lists[index % lists.length];
    const next = list.shift();
    if (next) out.push(next);
    index++;
  }
  return out;
}
