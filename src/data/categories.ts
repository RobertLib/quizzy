export interface Category {
  /** Matches `QuizQuestion.category`. */
  name: string;
  slug: string;
  emoji: string;
  /** One line for cards and meta descriptions. */
  tagline: string;
  /** Intro paragraphs for the category landing page. */
  intro: string[];
}

export const CATEGORIES: Category[] = [
  {
    name: "General Knowledge",
    slug: "general-knowledge",
    emoji: "🧩",
    tagline: "Everyday facts, words, food, animals and the odd curveball.",
    intro: [
      "General knowledge is the classic pub-quiz round: a bit of everything, from what's in your kitchen cupboard to the flags you half-remember from school. It rewards curiosity more than study — the kind of facts you pick up from reading labels, travelling and asking \"wait, why is that?\"",
      "Play a timed round to chase the speed bonus, or scroll down for the full list of questions with answers and a short explanation for each — handy if you're running a quiz night of your own.",
    ],
  },
  {
    name: "Science",
    slug: "science",
    emoji: "🔬",
    tagline: "Physics, chemistry, biology, space and the human body.",
    intro: [
      "Science trivia covers the big ideas and the strange details: why the sky is blue, what your bones are made of, which planet spins on its side. Easy questions stick to things you met in school; the hard ones dig into elements, units and the people behind famous discoveries.",
      "Every question below comes with its answer and a one-line explanation, so a wrong guess still teaches you something.",
    ],
  },
  {
    name: "History",
    slug: "history",
    emoji: "🏛️",
    tagline: "Empires, revolutions, explorers and turning points.",
    intro: [
      "History trivia spans thousands of years — ancient civilisations, medieval kingdoms, revolutions, world wars and the people who shaped them. Dates matter, but the best questions are about the moments and decisions behind them.",
      "Test yourself with a quick timed round, then read through the questions and explanations below to fill in the gaps.",
    ],
  },
  {
    name: "Geography",
    slug: "geography",
    emoji: "🗺️",
    tagline: "Capitals, rivers, mountains, borders and maps.",
    intro: [
      "Geography trivia is more than capital cities: rivers that cross borders, mountains on every continent, deserts, islands and the lines on the map that surprise people. If you can picture the globe, you're halfway there.",
      "Play a round against the clock, or browse every question with its answer and a short explanation further down the page.",
    ],
  },
  {
    name: "Literature",
    slug: "literature",
    emoji: "📖",
    tagline: "Novels, poets, plays, characters and famous first lines.",
    intro: [
      "Literature trivia covers the books people love to quote and the ones they pretend to have read — classic novels, plays, poetry, children's favourites and world literature beyond the English-speaking canon.",
      "Can you match the author to the character, or the first line to the novel? Play a round, then check the full question list with answers below.",
    ],
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    emoji: "➗",
    tagline: "Mental arithmetic, number facts, geometry and famous theorems.",
    intro: [
      "Maths trivia mixes quick mental arithmetic with number facts, geometry and the history of the subject — primes, Roman numerals, famous constants and the mathematicians behind the theorems.",
      "No calculator needed: every question is solvable in your head within the time limit. The explanations below show the quick working for each answer.",
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    emoji: "⚽",
    tagline: "Rules, records, Olympic history and iconic moments.",
    intro: [
      "Sports trivia goes beyond football scores — rules and terminology, the origins of games, Olympic history and the moments fans still argue about. Questions cover sports from around the world, not just the big leagues.",
      "Play a timed round to build a streak, or read the full list of questions, answers and explanations below.",
    ],
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    emoji: "🎬",
    tagline: "Film, music, TV, games and art.",
    intro: [
      "Entertainment trivia covers the films, songs, shows, games and paintings that everyone seems to know — and the behind-the-scenes facts they don't. Directors, composers, creators and the stories behind famous works.",
      "Start a round below, or scroll down for every question with its answer and a short explanation.",
    ],
  },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryByName(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name === name);
}
