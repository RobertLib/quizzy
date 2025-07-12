"use client";

import { useState, useEffect } from "react";
import { QuizQuestion, QuizAnswer } from "@/types/quiz";
import { decodeHtmlEntities, shuffleArray } from "@/lib/quiz-api";

interface QuizGameProps {
  initialQuestions: QuizQuestion[];
  onBackToConfig?: () => void;
  isOffline?: boolean;
}

export default function QuizGame({
  initialQuestions,
  onBackToConfig,
  isOffline = false,
}: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = initialQuestions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion) {
      const options = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];
      setShuffledOptions(shuffleArray(options));
    }
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const newAnswer: QuizAnswer = {
      question: decodeHtmlEntities(currentQuestion.question),
      userAnswer: decodeHtmlEntities(selectedAnswer),
      correctAnswer: decodeHtmlEntities(currentQuestion.correct_answer),
      isCorrect,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < initialQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setIsQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer("");
    setIsQuizCompleted(false);
    setScore(0);
  };

  if (isQuizCompleted) {
    return (
      <div className="max-w-4xl mx-auto glass p-8 mb-8 animate-scale-in">
        <div className="text-center mb-10">
          <div className="mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent mb-4">
              🎉 Quiz Completed!
            </h2>
            <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text mb-4">
              {score}/{initialQuestions.length}
            </div>
            <div className="w-32 h-1 bg-gradient-success mx-auto mb-4 rounded-full"></div>
            <p className="text-xl text-gray-600 mb-2">
              Your score: {Math.round((score / initialQuestions.length) * 100)}%
            </p>
            <p className="text-lg text-gray-500">
              {score === initialQuestions.length
                ? "🏆 Perfect score!"
                : score >= initialQuestions.length * 0.8
                ? "⭐ Excellent!"
                : score >= initialQuestions.length * 0.6
                ? "👍 Good job!"
                : "💪 Better luck next time!"}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            📝 Answer Review
          </h3>
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 animate-slide-in ${
                  answer.isCorrect
                    ? "border-green-200 bg-gradient-to-r from-green-50 to-green-100"
                    : "border-red-200 bg-gradient-to-r from-red-50 to-red-100"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <span
                    className={`text-2xl ${
                      answer.isCorrect ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {answer.isCorrect ? "✅" : "❌"}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-3 text-lg">
                      {answer.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-green-100 text-green-800">
                        <span className="font-medium">Your answer:</span>{" "}
                        {answer.userAnswer}
                      </div>
                      <div className="p-3 rounded-lg bg-green-100 text-green-800">
                        <span className="font-medium">Correct answer:</span>{" "}
                        {answer.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center flex-wrap gap-4">
          <button
            onClick={resetQuiz}
            className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
          >
            <span className="flex items-center">
              Play Again
              <span className="ml-2 group-hover:rotate-180 transition-transform duration-300">
                ↻
              </span>
            </span>
          </button>
          {onBackToConfig && (
            <button
              onClick={onBackToConfig}
              className="group px-8 py-4 bg-gradient-success text-white rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover-lift"
            >
              <span className="flex items-center">
                New Quiz
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto glass p-8 mb-8 animate-scale-in">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (currentQuestionIndex / initialQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto glass p-8 mb-8 animate-scale-in">
      {/* Offline Mode Indicator */}
      {isOffline && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl text-center shadow-lg animate-slide-in">
          <p className="text-sm font-medium flex items-center justify-center">
            <span className="mr-2">📱</span>
            Offline mode: Using cached questions (API temporarily unavailable)
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            Question {currentQuestionIndex + 1} of {initialQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            Score: {score} 🏆
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div
            className="progress-bar h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}% completed
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium">
            📚 {decodeHtmlEntities(currentQuestion.category)}
          </span>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === "easy"
                ? "bg-gradient-success text-white"
                : currentQuestion.difficulty === "medium"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                : "bg-gradient-secondary text-white"
            }`}
          >
            {currentQuestion.difficulty === "easy"
              ? "🟢 Easy"
              : currentQuestion.difficulty === "medium"
              ? "🟡 Medium"
              : "🔴 Hard"}
          </span>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
            {decodeHtmlEntities(currentQuestion.question)}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-10">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`group w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 hover-lift animate-slide-in ${
              selectedAnswer === option
                ? "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 shadow-md"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium flex-1 pr-4">
                {decodeHtmlEntities(option)}
              </span>
              <span
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                  selectedAnswer === option
                    ? "bg-white text-blue-500 border-white"
                    : "border-gray-300 group-hover:border-blue-400"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <div className="flex justify-center">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className={`group px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 transform whitespace-nowrap ${
            selectedAnswer
              ? "bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedAnswer ? (
            <span className="flex items-center">
              {currentQuestionIndex < initialQuestions.length - 1 ? (
                <>
                  Next Question
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </>
              ) : (
                <>
                  Complete Quiz
                  <span className="ml-2 group-hover:scale-110 transition-transform duration-300">
                    ✨
                  </span>
                </>
              )}
            </span>
          ) : (
            "Select an answer"
          )}
        </button>
      </div>
    </div>
  );
}
