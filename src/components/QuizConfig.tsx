"use client";

import { useState, useEffect } from "react";
import type { QuizConfig } from "@/types/quiz";

export interface QuizConfigProps {
  onStartQuiz: (config: QuizConfig) => void;
  isLoading: boolean;
}

const QUIZ_CONFIG_KEY = "quiz-config";

export default function QuizConfig({
  onStartQuiz,
  isLoading,
}: QuizConfigProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<
    "easy" | "medium" | "hard" | "mixed"
  >("mixed");
  const [amount, setAmount] = useState<number>(10);

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(QUIZ_CONFIG_KEY);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setSelectedCategories(config.categories || []);
        setDifficulty(config.difficulty || "mixed");
        setAmount(config.amount || 10);
      } catch (error) {
        console.error("Failed to load saved quiz configuration:", error);
      }
    }
  }, []);

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
    <div className="max-w-5xl mx-auto glass p-8 mb-8 animate-scale-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          🎯 Quiz Configuration
        </h2>
        <p className="text-gray-600 text-lg">Customize your quiz experience</p>
        <div className="w-24 h-1 bg-gradient-primary mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Categories Selection */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center">
            📚 Categories
          </h3>
          <div className="flex space-x-3">
            <button
              onClick={handleSelectAllCategories}
              className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAllCategories}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableCategories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`group p-4 rounded-2xl border-2 text-left transition-all duration-300 hover-lift animate-slide-in ${
                selectedCategories.includes(category)
                  ? "border-transparent bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 shadow-md"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{category}</span>
                {selectedCategories.includes(category) ? (
                  <span className="text-white text-xl">✨</span>
                ) : (
                  <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    +
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-sm text-gray-500 mt-4 text-center italic">
            💡 No categories selected - all categories will be used
          </p>
        )}
      </div>

      {/* Difficulty Selection */}
      <div className="mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          🎚️ Difficulty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {difficultyOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => setDifficulty(option.value)}
              className={`group p-5 rounded-2xl border-2 text-left transition-all duration-300 hover-lift animate-slide-in ${
                difficulty === option.value
                  ? `border-transparent shadow-lg ${
                      option.value === "easy"
                        ? "bg-gradient-success text-white"
                        : option.value === "medium"
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                        : option.value === "hard"
                        ? "bg-gradient-secondary text-white"
                        : "bg-gradient-primary text-white"
                    }`
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 shadow-md"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{option.label}</span>
                {difficulty === option.value && (
                  <span className="text-white text-xl">⭐</span>
                )}
              </div>
              <p
                className={`text-sm ${
                  difficulty === option.value
                    ? "text-white/90"
                    : "text-gray-600"
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
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          🔢 Number of Questions
        </h3>
        <div className="flex flex-wrap gap-3 mb-6">
          {amountOptions.map((option, index) => (
            <button
              key={option}
              onClick={() => setAmount(option)}
              className={`px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 hover-lift animate-scale-in ${
                amount === option
                  ? "border-transparent bg-gradient-primary text-white shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 shadow-md"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🎯 Custom amount:
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
              className="w-32 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium shadow-inner"
            />
            <span className="text-sm text-gray-500">(1-50 questions)</span>
          </div>
        </div>
      </div>

      {/* Start Quiz Button */}
      <div className="text-center">
        <button
          onClick={handleStartQuiz}
          disabled={isLoading}
          className={`group px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 transform ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-glow"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
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
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
