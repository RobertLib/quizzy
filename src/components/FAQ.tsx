import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Quizzy?",
      answer:
        "Quizzy is an interactive quiz application that allows you to test your knowledge across various categories including science, history, sports, entertainment, and more. With multiple difficulty levels and instant feedback, it's perfect for learning and fun!",
    },
    {
      question: "How many questions are available?",
      answer:
        "Quizzy offers thousands of questions across multiple categories. You can choose the number of questions for each quiz session, from quick 5-question quizzes to comprehensive 50-question challenges.",
    },
    {
      question: "What categories are available?",
      answer:
        "We offer a wide range of categories including General Knowledge, Science, History, Sports, Entertainment, Geography, Literature, Mathematics, and many more. Each category has questions of varying difficulty levels.",
    },
    {
      question: "Can I choose the difficulty level?",
      answer:
        "Yes! Quizzy offers three difficulty levels: Easy, Medium, and Hard. You can select the level that best matches your knowledge and comfort level for each quiz session.",
    },
    {
      question: "Is Quizzy free to use?",
      answer:
        "Yes, Quizzy is completely free to use. You can access all categories, difficulty levels, and features without any cost or registration required.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account creation is required! You can start playing quizzes immediately. Simply configure your preferences and begin testing your knowledge right away.",
    },
  ];

  return (
    <section className="max-w-4xl mx-auto mt-16 p-8 bg-white rounded-xl shadow-sm">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-slate-200 pb-6 last:border-b-0"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {faq.question}
            </h3>
            <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
