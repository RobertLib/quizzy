import { NextRequest, NextResponse } from "next/server";
import { QuizApiResponse, QuizConfig } from "@/types/quiz";
import { shuffleArray } from "@/lib/quiz-api";
import { fallbackQuestions } from "@/data/fallback-questions";

// Mapping our categories to API category IDs
const CATEGORY_TO_API_ID: Record<string, number> = {
  "General Knowledge": 9,
  Science: 17, // Science & Nature
  History: 23,
  Geography: 22,
  Literature: 10, // Entertainment: Books
  Mathematics: 19, // Science: Mathematics
  Sports: 21,
  Entertainment: 11, // Entertainment: Film (we'll use one main entertainment category)
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const amount = parseInt(searchParams.get("amount") || "10");
    const difficulty = searchParams.get("difficulty");
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];

    // Always try API first
    let apiUrl = `https://opentdb.com/api.php?amount=${amount}`;

    // Apply difficulty filter if specified
    if (difficulty && difficulty !== "mixed") {
      apiUrl += `&difficulty=${difficulty}`;
    }

    // Apply category filter if specified
    if (categories.length > 0) {
      // For now, use the first selected category (API doesn't support multiple categories in one request)
      const categoryId = CATEGORY_TO_API_ID[categories[0]];
      if (categoryId) {
        apiUrl += `&category=${categoryId}`;
      }
    }

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Quizzy-App/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code !== 0) {
      throw new Error(`API response code: ${data.response_code}`);
    }

    // API SUCCESS - return API data as-is
    const result: QuizApiResponse = {
      response_code: 0,
      results: data.results,
      isOffline: false,
    };

    return NextResponse.json(result);
  } catch (error) {
    // API FAILED - use fallback
    console.warn("API failed, using fallback questions:", error);

    const searchParams = request.nextUrl.searchParams;
    const amount = parseInt(searchParams.get("amount") || "10");
    const difficulty = searchParams.get("difficulty");
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];

    // Create config for fallback filtering
    const config: QuizConfig | undefined =
      difficulty || categories.length > 0
        ? {
            difficulty: (difficulty as "easy" | "medium" | "hard") || "mixed",
            categories,
            amount,
          }
        : undefined;

    // Use fallback questions with filtering
    let filteredQuestions = [...fallbackQuestions];

    if (config) {
      // Filter by categories
      if (config.categories.length > 0) {
        filteredQuestions = filteredQuestions.filter((q) =>
          config.categories.includes(q.category)
        );
      }

      // Filter by difficulty
      if (config.difficulty !== "mixed") {
        filteredQuestions = filteredQuestions.filter(
          (q) => q.difficulty === config.difficulty
        );
      }
    }

    if (filteredQuestions.length < amount) {
      console.warn(
        `Only ${filteredQuestions.length} questions available after filtering, but ${amount} requested`
      );
    }

    const shuffledQuestions = shuffleArray(filteredQuestions);
    const finalQuestions = shuffledQuestions.slice(0, amount);

    const fallbackResult: QuizApiResponse = {
      response_code: 0,
      results: finalQuestions,
      isOffline: true,
    };

    return NextResponse.json(fallbackResult);
  }
}
