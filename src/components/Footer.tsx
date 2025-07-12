import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 py-8 border-t border-white/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Quizzy</h3>
          <p className="text-white/70 text-sm max-w-2xl mx-auto">
            Your ultimate destination for interactive quizzes. Test your
            knowledge, learn new facts, and have fun with our extensive
            collection of trivia questions across multiple categories and
            difficulty levels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-2">Features</h4>
            <ul className="text-white/70 space-y-1">
              <li>Multiple Categories</li>
              <li>Difficulty Levels</li>
              <li>Instant Results</li>
              <li>Progress Tracking</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">
              Popular Categories
            </h4>
            <ul className="text-white/70 space-y-1">
              <li>Science & Nature</li>
              <li>History</li>
              <li>Sports</li>
              <li>Entertainment</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Benefits</h4>
            <ul className="text-white/70 space-y-1">
              <li>Free to Use</li>
              <li>No Registration</li>
              <li>Mobile Friendly</li>
              <li>Educational & Fun</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <p className="text-white/60 text-sm">
            © 2025 Quizzy. Built with ❤️ by Robert Libsansky.
            <span className="block mt-1">
              Enhance your knowledge through interactive learning.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
