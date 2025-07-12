"use client";

import { useState, useMemo } from "react";
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
  const currentQuestion = initialQuestions[currentQuestionIndex];

  const shuffledOptions = useMemo(() => {
    if (currentQuestion) {
      const options = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ];
      return shuffleArray(options);
    }
    return [];
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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="text-center mb-10">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-quizzy mb-4">
              Quiz Completed!
            </h2>
            <div className="text-7xl font-bold text-quizzy mb-4">
              {score}/{initialQuestions.length}
            </div>
            <p className="text-xl text-slate-600 mb-2">
              Your score: {Math.round((score / initialQuestions.length) * 100)}%
            </p>
            <p className="text-lg text-slate-500">
              {score === initialQuestions.length
                ? "Perfect score!"
                : score >= initialQuestions.length * 0.8
                ? "Excellent!"
                : score >= initialQuestions.length * 0.6
                ? "Good job!"
                : "Better luck next time!"}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="text-2xl font-semibold text-slate-900 text-center mb-6">
            Answer Review
          </h3>
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  answer.isCorrect
                    ? "border-quizzy-light bg-quizzy-lighter"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span
                    className={`text-xl ${
                      answer.isCorrect ? "text-quizzy" : "text-red-600"
                    }`}
                  >
                    {answer.isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 mb-3">
                      {answer.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div
                        className={`p-3 rounded-lg ${
                          answer.isCorrect
                            ? "bg-quizzy-light text-quizzy-dark"
                            : "bg-red-100 text-red-900"
                        }`}
                      >
                        <span className="font-medium">Your answer:</span>{" "}
                        {answer.userAnswer}
                      </div>
                      <div className="p-3 rounded-lg bg-quizzy-light text-quizzy-dark">
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
            className="px-8 py-3 bg-quizzy text-white rounded-lg font-semibold transition-colors hover:bg-quizzy-hover"
          >
            <span className="flex items-center">
              Play Again
              <span className="ml-2">↻</span>
            </span>
          </button>
          {onBackToConfig && (
            <button
              onClick={onBackToConfig}
              className="px-8 py-3 bg-slate-200 text-quizzy rounded-lg font-semibold transition-colors hover:bg-slate-300"
            >
              <span className="flex items-center">
                New Quiz
                <span className="ml-2">→</span>
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-quizzy mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (currentQuestionIndex / initialQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 mb-8">
      {/* Offline Mode Indicator */}
      {isOffline && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 text-yellow-900 rounded-lg text-center">
          <p className="text-sm font-medium">
            Offline mode: Using cached questions (API temporarily unavailable)
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            Question {currentQuestionIndex + 1} of {initialQuestions.length}
          </span>
          <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            Score: {score}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-quizzy h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-slate-500">
            {Math.round(progressPercentage)}% completed
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <span className="inline-block px-4 py-2 bg-quizzy text-white rounded-lg text-sm font-medium">
            {decodeHtmlEntities(currentQuestion.category)}
          </span>
          <span
            className={`inline-block px-4 py-2 rounded-lg text-sm font-medium text-white ${
              currentQuestion.difficulty === "easy"
                ? "bg-green-600"
                : currentQuestion.difficulty === "medium"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          >
            {currentQuestion.difficulty === "easy"
              ? "Easy"
              : currentQuestion.difficulty === "medium"
              ? "Medium"
              : "Hard"}
          </span>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border-2 border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 leading-relaxed">
            {decodeHtmlEntities(currentQuestion.question)}
          </h2>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-10">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full p-5 text-left rounded-lg border-2 transition-colors ${
              selectedAnswer === option
                ? "border-quizzy bg-quizzy text-white"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium flex-1 pr-4">
                {decodeHtmlEntities(option)}
              </span>
              <span
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                  selectedAnswer === option
                    ? "bg-white text-quizzy border-white"
                    : "border-slate-300"
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
          className={`px-12 py-4 rounded-lg font-semibold text-lg transition-colors ${
            selectedAnswer
              ? "bg-quizzy text-white hover:bg-quizzy-hover"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {selectedAnswer ? (
            <span className="flex items-center">
              {currentQuestionIndex < initialQuestions.length - 1 ? (
                <>
                  Next Question
                  <span className="ml-2">→</span>
                </>
              ) : (
                <>
                  Complete Quiz
                  <span className="ml-2">✓</span>
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
