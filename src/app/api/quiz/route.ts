import { NextRequest, NextResponse } from "next/server";
import { QuizApiResponse, QuizQuestion, Difficulty } from "@/types/quiz";
import { shuffleArray } from "@/lib/quiz-api";
import { fallbackQuestions } from "@/data/fallback-questions";

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
const REQUEST_TIMEOUT_MS = 7000;

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
  difficulty: string | null,
  categoryId: number | null,
  attempt = 0
): Promise<QuizQuestion[]> {
  const params = new URLSearchParams({
    amount: String(amount),
    type: "multiple",
    encode: "url3986",
  });
  if (difficulty && difficulty !== "mixed") params.set("difficulty", difficulty);
  if (categoryId) params.set("category", String(categoryId));

  const response = await fetch(`https://opentdb.com/api.php?${params}`, {
    headers: { "User-Agent": "Quizzy-App/2.0" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  // Open Trivia DB allows one request per IP every few seconds — back off once.
  if (response.status === 429 && attempt < 1) {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return fetchOpenTdb(amount, difficulty, categoryId, attempt + 1);
  }

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

function bankFor(categories: string[], difficulty: string | null) {
  let pool = [...fallbackQuestions];
  if (categories.length > 0) {
    pool = pool.filter((q) => categories.includes(q.category));
  }
  if (difficulty && difficulty !== "mixed") {
    pool = pool.filter((q) => q.difficulty === difficulty);
  }
  // If a filter combination is too narrow, relax difficulty before giving up.
  if (pool.length === 0 && categories.length > 0) {
    pool = fallbackQuestions.filter((q) => categories.includes(q.category));
  }
  return pool.length > 0 ? pool : [...fallbackQuestions];
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

  const add = (questions: QuizQuestion[]) => {
    for (const question of questions) {
      const key = normalizeKey(question.question);
      if (seen.has(key)) continue;
      seen.add(key);
      collected.push(question);
    }
  };

  // One upstream request per selected category so multi-category quizzes are
  // genuinely mixed. Requests are staggered because the upstream rate-limits.
  const targets: (number | null)[] =
    categories.length > 0
      ? categories.map((c) => CATEGORY_TO_API_ID[c])
      : [null];
  const perTarget = Math.max(3, Math.ceil((amount / targets.length) * 1.4));

  const settled = await Promise.allSettled(
    targets.map(async (categoryId, index) => {
      if (index > 0) {
        await new Promise((resolve) => setTimeout(resolve, index * 350));
      }
      return fetchOpenTdb(perTarget, difficulty, categoryId);
    })
  );

  let upstreamFailures = 0;
  for (const result of settled) {
    if (result.status === "fulfilled") add(result.value);
    else upstreamFailures++;
  }

  // Top up from the bundled bank so a partial upstream failure (the rate limit
  // hits one category but not another) still yields a full quiz.
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
    isOffline: upstreamFailures === settled.length,
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
