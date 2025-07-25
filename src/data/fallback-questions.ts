import { QuizQuestion } from "@/types/quiz";

export const fallbackQuestions: QuizQuestion[] = [
  {
    type: "multiple",
    difficulty: "easy",
    category: "General Knowledge",
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Science",
    question: "What is the chemical symbol for water?",
    correct_answer: "H2O",
    incorrect_answers: ["CO2", "O2", "NaCl"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "History",
    question: "In which year did World War II end?",
    correct_answer: "1945",
    incorrect_answers: ["1944", "1946", "1943"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Geography",
    question: "Which is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Science",
    question: "The Earth is the third planet from the Sun.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Literature",
    question: 'Who wrote the novel "1984"?',
    correct_answer: "George Orwell",
    incorrect_answers: ["Aldous Huxley", "Ray Bradbury", "Kurt Vonnegut"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Mathematics",
    question: "What is 12 × 12?",
    correct_answer: "144",
    incorrect_answers: ["124", "134", "154"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Sports",
    question:
      "How many players are there in a basketball team on court at one time?",
    correct_answer: "5",
    incorrect_answers: ["6", "7", "4"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Entertainment",
    question: "What is the highest-grossing film of all time?",
    correct_answer: "Avatar (2009)",
    incorrect_answers: [
      "Titanic",
      "Avengers: Endgame",
      "Star Wars: The Force Awakens",
    ],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "General Knowledge",
    question: "A group of lions is called a pride.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Science",
    question: "What is the atomic number of carbon?",
    correct_answer: "6",
    incorrect_answers: ["8", "12", "14"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Mathematics",
    question: "What is the derivative of x³?",
    correct_answer: "3x²",
    incorrect_answers: ["x²", "3x", "x³"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Geography",
    question: "Which country has the most time zones?",
    correct_answer: "France",
    incorrect_answers: ["Russia", "USA", "China"],
  },
  {
    type: "boolean",
    difficulty: "medium",
    category: "History",
    question: "The Berlin Wall fell in 1989.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Entertainment",
    question: "Which movie features the song 'Let It Go'?",
    correct_answer: "Frozen",
    incorrect_answers: ["Moana", "Tangled", "Brave"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Literature",
    question: "Who wrote 'One Hundred Years of Solitude'?",
    correct_answer: "Gabriel García Márquez",
    incorrect_answers: [
      "Mario Vargas Llosa",
      "Jorge Luis Borges",
      "Pablo Neruda",
    ],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Sports",
    question: "In which sport would you perform a slam dunk?",
    correct_answer: "Basketball",
    incorrect_answers: ["Volleyball", "Tennis", "Baseball"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Science",
    question: "Water boils at 100°C at sea level.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge",
    question: "What is the smallest country in the world?",
    correct_answer: "Vatican City",
    incorrect_answers: ["Monaco", "San Marino", "Liechtenstein"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Entertainment",
    question: "Which TV series is set in the fictional town of Hawkins?",
    correct_answer: "Stranger Things",
    incorrect_answers: ["The Walking Dead", "Lost", "Twin Peaks"],
  },
  {
    type: "boolean",
    difficulty: "hard",
    category: "Mathematics",
    question: "Pi is a rational number.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Geography",
    question: "What is the capital of Japan?",
    correct_answer: "Tokyo",
    incorrect_answers: ["Kyoto", "Osaka", "Hiroshima"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "History",
    question: "Which empire was ruled by Julius Caesar?",
    correct_answer: "Roman Empire",
    incorrect_answers: ["Greek Empire", "Egyptian Empire", "Persian Empire"],
  },
  {
    type: "boolean",
    difficulty: "medium",
    category: "Sports",
    question: "A marathon is 42.195 kilometers long.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Science",
    question:
      "What gas do plants absorb from the atmosphere during photosynthesis?",
    correct_answer: "Carbon dioxide",
    incorrect_answers: ["Oxygen", "Nitrogen", "Hydrogen"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "History",
    question: "Which ancient wonder of the world was located in Alexandria?",
    correct_answer: "The Lighthouse of Alexandria",
    incorrect_answers: [
      "The Colossus of Rhodes",
      "The Hanging Gardens",
      "The Great Pyramid",
    ],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Geography",
    question: "Which continent is known as the 'Dark Continent'?",
    correct_answer: "Africa",
    incorrect_answers: ["Asia", "South America", "Australia"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Literature",
    question: "Who wrote 'Romeo and Juliet'?",
    correct_answer: "William Shakespeare",
    incorrect_answers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Mathematics",
    question: "What is 15 + 25?",
    correct_answer: "40",
    incorrect_answers: ["35", "45", "50"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Sports",
    question: "How many players are in a soccer team on the field at one time?",
    correct_answer: "11",
    incorrect_answers: ["10", "12", "9"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "Entertainment",
    question: "Which movie features the character 'Luke Skywalker'?",
    correct_answer: "Star Wars",
    incorrect_answers: ["Star Trek", "Guardians of the Galaxy", "Avatar"],
  },
  {
    type: "multiple",
    difficulty: "easy",
    category: "General Knowledge",
    question: "How many continents are there?",
    correct_answer: "7",
    incorrect_answers: ["5", "6", "8"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Science",
    question: "What is the hardest natural substance on Earth?",
    correct_answer: "Diamond",
    incorrect_answers: ["Gold", "Iron", "Titanium"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "History",
    question: "Who was the first person to walk on the moon?",
    correct_answer: "Neil Armstrong",
    incorrect_answers: ["Buzz Aldrin", "John Glenn", "Alan Shepard"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Geography",
    question: "What is the longest river in the world?",
    correct_answer: "The Nile",
    incorrect_answers: ["The Amazon", "The Mississippi", "The Yangtze"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Literature",
    question: "Which novel begins with 'Call me Ishmael'?",
    correct_answer: "Moby Dick",
    incorrect_answers: [
      "The Great Gatsby",
      "To Kill a Mockingbird",
      "Pride and Prejudice",
    ],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Mathematics",
    question: "What is the square root of 144?",
    correct_answer: "12",
    incorrect_answers: ["10", "14", "16"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Sports",
    question: "In which year were the first modern Olympic Games held?",
    correct_answer: "1896",
    incorrect_answers: ["1900", "1892", "1888"],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "Entertainment",
    question: "Who directed the movie 'Jaws'?",
    correct_answer: "Steven Spielberg",
    incorrect_answers: [
      "George Lucas",
      "Francis Ford Coppola",
      "Martin Scorsese",
    ],
  },
  {
    type: "multiple",
    difficulty: "medium",
    category: "General Knowledge",
    question: "What is the chemical symbol for gold?",
    correct_answer: "Au",
    incorrect_answers: ["Go", "Gd", "Ag"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Science",
    question:
      "What is the name of the theoretical boundary around a black hole?",
    correct_answer: "Event Horizon",
    incorrect_answers: ["Singularity", "Photon Sphere", "Ergosphere"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "History",
    question: "Which treaty ended World War I?",
    correct_answer: "Treaty of Versailles",
    incorrect_answers: [
      "Treaty of Paris",
      "Treaty of Trianon",
      "Treaty of Brest-Litovsk",
    ],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Geography",
    question: "What is the deepest point in the world's oceans?",
    correct_answer: "Challenger Deep",
    incorrect_answers: ["Puerto Rico Trench", "Java Trench", "Tonga Trench"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Literature",
    question: "Who wrote 'The Brothers Karamazov'?",
    correct_answer: "Fyodor Dostoevsky",
    incorrect_answers: ["Leo Tolstoy", "Anton Chekhov", "Ivan Turgenev"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Mathematics",
    question: "What is the integral of 1/x?",
    correct_answer: "ln(x) + C",
    incorrect_answers: ["x + C", "1/x² + C", "x²/2 + C"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Sports",
    question: "Which country has won the most FIFA World Cups?",
    correct_answer: "Brazil",
    incorrect_answers: ["Germany", "Italy", "Argentina"],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "Entertainment",
    question: "Which composer wrote 'The Magic Flute'?",
    correct_answer: "Wolfgang Amadeus Mozart",
    incorrect_answers: [
      "Ludwig van Beethoven",
      "Johann Sebastian Bach",
      "Franz Schubert",
    ],
  },
  {
    type: "multiple",
    difficulty: "hard",
    category: "General Knowledge",
    question: "What is the most abundant gas in Earth's atmosphere?",
    correct_answer: "Nitrogen",
    incorrect_answers: ["Oxygen", "Carbon Dioxide", "Argon"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Science",
    question:
      "The speed of light is approximately 300,000 kilometers per second.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "History",
    question: "The Great Wall of China was built in a single dynasty.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Geography",
    question: "Australia is both a country and a continent.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Literature",
    question: "Harry Potter was created by J.K. Rowling.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Mathematics",
    question: "The number zero is considered an even number.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Sports",
    question: "The Olympics are held every four years.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "Entertainment",
    question: "Mickey Mouse was created by Walt Disney.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
  {
    type: "boolean",
    difficulty: "easy",
    category: "General Knowledge",
    question: "Bananas are berries.",
    correct_answer: "True",
    incorrect_answers: ["False"],
  },
];
