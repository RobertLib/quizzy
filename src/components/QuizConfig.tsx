"use client";

import { useState, useEffect, useMemo } from "react";
import type { QuizConfig } from "@/types/quiz";

export interface QuizConfigProps {
  onStartQuiz: (config: QuizConfig) => void;
  isLoading: boolean;
}

const QUIZ_CONFIG_KEY = "quiz-config";

function getInitialConfig() {
  if (typeof window === "undefined") {
    return { categories: [], difficulty: "mixed" as const, amount: 10 };
  }
  const savedConfig = localStorage.getItem(QUIZ_CONFIG_KEY);
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      return {
        categories: config.categories || [],
        difficulty: config.difficulty || "mixed",
        amount: config.amount || 10,
      };
    } catch (error) {
      console.error("Failed to load saved quiz configuration:", error);
    }
  }
  return { categories: [], difficulty: "mixed" as const, amount: 10 };
}

export default function QuizConfig({
  onStartQuiz,
  isLoading,
}: QuizConfigProps) {
  const initialConfig = useMemo(() => getInitialConfig(), []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialConfig.categories
  );
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | "mixed"
  >(initialConfig.difficulty);
  const [amount, setAmount] = useState<number>(initialConfig.amount);

  // Save configuration whenever it changes
  useEffect(() => {
    const config = {
      categories: selectedCategories,
      difficulty,
      amount,
    };
    localStorage.setItem(QUIZ_CONFIG_KEY, JSON.stringify(config));
  }, [selectedCategories, difficulty, amount]);

  // Available categories that map to API categories
  const availableCategories = [
    "General Knowledge",
    "Science",
    "History",
    "Geography",
    "Literature",
    "Mathematics",
    "Sports",
    "Entertainment",
  ];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(availableCategories);
  };

  const handleDeselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleStartQuiz = () => {
    const config: QuizConfig = {
      categories: selectedCategories,
      difficulty,
      amount,
    };

    onStartQuiz(config);
  };

  const difficultyOptions = [
    { value: "mixed", label: "Mixed", description: "All difficulty levels" },
    { value: "easy", label: "Easy", description: "Beginner friendly" },
    { value: "medium", label: "Medium", description: "Moderate challenge" },
    { value: "hard", label: "Hard", description: "Expert level" },
  ] as const;

  const amountOptions = [5, 10, 15, 20, 25, 30];

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Quiz Configuration
        </h2>
        <p className="text-slate-600">Customize your quiz experience</p>
      </div>

      {/* Categories Selection */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-xl font-semibold text-slate-900">Categories</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAllCategories}
              className="px-4 py-2 text-sm bg-quizzy text-white rounded-lg hover:bg-quizzy-hover transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAllCategories}
              className="px-4 py-2 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedCategories.includes(category)
                  ? "border-quizzy bg-quizzy text-white"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{category}</span>
                {selectedCategories.includes(category) && (
                  <span className="text-white">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-sm text-slate-500 mt-4 text-center">
            No categories selected - all categories will be used
          </p>
        )}
      </div>

      {/* Difficulty Selection */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          Difficulty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {difficultyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setDifficulty(option.value)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                difficulty === option.value
                  ? "border-quizzy bg-quizzy text-white"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{option.label}</span>
                {difficulty === option.value && (
                  <span className="text-white">✓</span>
                )}
              </div>
              <p
                className={`text-sm ${
                  difficulty === option.value
                    ? "text-white/90"
                    : "text-slate-600"
                }`}
              >
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold text-slate-900 mb-6">
          Number of Questions
        </h3>
        <div className="flex flex-wrap gap-3 mb-6">
          {amountOptions.map((option) => (
            <button
              key={option}
              onClick={() => setAmount(option)}
              className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                amount === option
                  ? "border-quizzy bg-quizzy text-white"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Custom amount:
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              max="50"
              value={amount}
              onChange={(e) =>
                setAmount(
                  Math.max(1, Math.min(50, parseInt(e.target.value) || 1))
                )
              }
              className="w-32 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-quizzy focus:border-quizzy text-center font-medium"
            />
            <span className="text-sm text-slate-500">(1-50 questions)</span>
          </div>
        </div>
      </div>

      {/* Start Quiz Button */}
      <div className="text-center">
        <button
          onClick={handleStartQuiz}
          disabled={isLoading}
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-colors ${
            isLoading
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-quizzy text-white hover:bg-quizzy-hover"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading Questions...
            </span>
          ) : (
            <span className="flex items-center">
              Start Quiz
              <span className="ml-2">→</span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
