"use client";

import { useState } from "react";
import { fetchQuizQuestions } from "@/lib/quiz-api";
import QuizGame from "@/components/QuizGame";
import QuizConfig from "@/components/QuizConfig";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import type { QuizQuestion, QuizConfig as QuizConfigType } from "@/types/quiz";

export default function Home() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const handleStartQuiz = async (config: QuizConfigType) => {
    setIsLoading(true);
    try {
      const quizData = await fetchQuizQuestions(config.amount, config);
      setQuizQuestions(quizData.results);
      setIsOffline(!!quizData.isOffline);
      setIsConfiguring(false);
    } catch (error) {
      console.error("Failed to load quiz questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToConfig = () => {
    setIsConfiguring(true);
    setQuizQuestions([]);
    setIsOffline(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-quizzy mb-4">
            Quizzy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Test your knowledge with interactive quizzes
          </p>
        </header>

        <div>
          {isConfiguring ? (
            <QuizConfig onStartQuiz={handleStartQuiz} isLoading={isLoading} />
          ) : (
            <div>
              <div className="max-w-4xl mx-auto mb-6">
                <button
                  onClick={handleBackToConfig}
                  className="flex items-center px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <span className="mr-2">←</span>
                  Back to Configuration
                </button>
              </div>
              <QuizGame
                initialQuestions={quizQuestions}
                onBackToConfig={handleBackToConfig}
                isOffline={isOffline}
              />
            </div>
          )}
        </div>

        {isConfiguring && (
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Features
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Multiple Categories
                  </h3>
                  <p className="text-sm text-slate-600">
                    Choose from science, history, sports, entertainment, and
                    many more topics
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Different Difficulty Levels
                  </h3>
                  <p className="text-sm text-slate-600">
                    From beginner to expert - find the perfect challenge for
                    your skill level
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Instant Results
                  </h3>
                  <p className="text-sm text-slate-600">
                    Get immediate feedback and track your progress with detailed
                    scoring
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isConfiguring && <FAQ />}
        <Footer />
      </div>
    </div>
  );
}
