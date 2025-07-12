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
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-12 pt-16 animate-slide-in">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Quizzy
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              🧠 Test your knowledge with our interactive quizzes!
            </p>
            <p className="text-lg text-white/80 mt-2">
              Thousands of questions from various categories await you
            </p>
          </div>

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto text-white/70 text-sm mb-8">
            <p className="mb-4">
              <strong>Welcome to Quizzy</strong> - the ultimate interactive quiz
              platform where learning meets fun! Challenge yourself with our
              extensive collection of trivia questions spanning multiple
              categories including science, history, sports, entertainment, and
              more.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <h2 className="font-semibold text-white mb-2">
                  🎯 Multiple Categories
                </h2>
                <p className="text-sm">
                  Choose from science, history, sports, entertainment, and many
                  more topics
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <h2 className="font-semibold text-white mb-2">
                  ⚡ Different Difficulty Levels
                </h2>
                <p className="text-sm">
                  From beginner to expert - find the perfect challenge for your
                  skill level
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                <h2 className="font-semibold text-white mb-2">
                  📊 Instant Results
                </h2>
                <p className="text-sm">
                  Get immediate feedback and track your progress with detailed
                  scoring
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="animate-scale-in">
          {isConfiguring ? (
            <QuizConfig onStartQuiz={handleStartQuiz} isLoading={isLoading} />
          ) : (
            <div>
              <div className="max-w-4xl mx-auto mb-6">
                <button
                  onClick={handleBackToConfig}
                  className="group flex items-center px-6 py-3 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover-lift backdrop-blur-md border border-white/20"
                >
                  <span className="mr-2 group-hover:-translate-x-1 transition-transform duration-300">
                    ←
                  </span>
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

        {/* FAQ Section - visible only on config screen */}
        {isConfiguring && <FAQ />}

        {/* Footer - always visible */}
        <Footer />
      </div>
    </div>
  );
}
