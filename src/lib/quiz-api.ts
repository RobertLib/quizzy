import { QuizApiResponse, QuizConfig, QuizQuestion } from "@/types/quiz";
import { fallbackQuestions } from "@/data/fallback-questions";

export async function fetchQuizQuestions(
  amount: number = 10,
  config?: QuizConfig
): Promise<QuizApiResponse> {
  try {
    // Build URL for our internal API
    const params = new URLSearchParams({
      amount: amount.toString(),
    });

    // Apply difficulty filter if specified
    if (config && config.difficulty !== "mixed") {
      params.append("difficulty", config.difficulty);
    }

    // Apply category filter if specified
    if (config && config.categories.length > 0) {
      params.append("categories", config.categories.join(","));
    }

    const apiUrl = `/api/quiz?${params.toString()}`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 0 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: QuizApiResponse = await response.json();
    return data;
  } catch (error) {
    // API FAILED - use fallback
    console.warn("Internal API failed, using fallback questions:", error);
    return getFilteredFallbackQuestions(amount, config);
  }
}

function getFilteredFallbackQuestions(
  amount: number,
  config?: QuizConfig
): QuizApiResponse {
  const filteredQuestions = config
    ? filterQuestionsByConfig(fallbackQuestions, config)
    : fallbackQuestions;

  if (filteredQuestions.length < amount) {
    console.warn(
      `Only ${filteredQuestions.length} questions available after filtering, but ${amount} requested`
    );
  }

  const shuffledQuestions = shuffleArray(filteredQuestions);
  const finalQuestions = shuffledQuestions.slice(0, amount);

  return {
    response_code: 0,
    results: finalQuestions,
    isOffline: true, // Mark as offline/fallback data
  };
}

function filterQuestionsByConfig(
  questions: QuizQuestion[],
  config: QuizConfig
): QuizQuestion[] {
  let filtered = [...questions];

  // Filter by categories
  if (config.categories.length > 0) {
    filtered = filtered.filter((q) => config.categories.includes(q.category));
  }

  // Filter by difficulty
  if (config.difficulty !== "mixed") {
    filtered = filtered.filter((q) => q.difficulty === config.difficulty);
  }

  return filtered;
}

export function decodeHtmlEntities(text: string): string {
  // Server-safe HTML entity decoder with comprehensive entity support
  const entities: { [key: string]: string } = {
    // Basic HTML entities
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&nbsp;": " ",

    // Copyright, trademark, etc.
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",

    // Punctuation
    "&hellip;": "…",
    "&mdash;": "—",
    "&ndash;": "–",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&bull;": "•",
    "&middot;": "·",

    // Mathematical symbols
    "&deg;": "°",
    "&plusmn;": "±",
    "&times;": "×",
    "&divide;": "÷",
    "&frac12;": "½",
    "&frac14;": "¼",
    "&frac34;": "¾",
    "&sup2;": "²",
    "&sup3;": "³",
    "&sup1;": "¹",
    "&micro;": "µ",
    "&para;": "¶",
    "&sect;": "§",
    "&alpha;": "α",
    "&beta;": "β",
    "&gamma;": "γ",
    "&delta;": "δ",
    "&epsilon;": "ε",
    "&lambda;": "λ",
    "&mu;": "μ",
    "&pi;": "π",
    "&sigma;": "σ",
    "&tau;": "τ",
    "&phi;": "φ",
    "&omega;": "ω",
    "&infin;": "∞",
    "&le;": "≤",
    "&ge;": "≥",
    "&ne;": "≠",
    "&asymp;": "≈",
    "&equiv;": "≡",
    "&sum;": "∑",
    "&prod;": "∏",
    "&radic;": "√",
    "&prop;": "∝",
    "&part;": "∂",
    "&int;": "∫",
    "&nabla;": "∇",
    "&oplus;": "⊕",
    "&otimes;": "⊗",
    "&perp;": "⊥",
    "&ang;": "∠",
    "&and;": "∧",
    "&or;": "∨",
    "&cap;": "∩",
    "&cup;": "∪",
    "&sub;": "⊂",
    "&sup;": "⊃",
    "&sube;": "⊆",
    "&supe;": "⊇",
    "&isin;": "∈",
    "&notin;": "∉",
    "&ni;": "∋",
    "&exist;": "∃",
    "&forall;": "∀",
    "&empty;": "∅",

    // Accented characters
    "&agrave;": "à",
    "&aacute;": "á",
    "&acirc;": "â",
    "&atilde;": "ã",
    "&auml;": "ä",
    "&aring;": "å",
    "&aelig;": "æ",
    "&ccedil;": "ç",
    "&egrave;": "è",
    "&eacute;": "é",
    "&ecirc;": "ê",
    "&euml;": "ë",
    "&igrave;": "ì",
    "&iacute;": "í",
    "&icirc;": "î",
    "&iuml;": "ï",
    "&eth;": "ð",
    "&ntilde;": "ñ",
    "&ograve;": "ò",
    "&oacute;": "ó",
    "&ocirc;": "ô",
    "&otilde;": "õ",
    "&ouml;": "ö",
    "&oslash;": "ø",
    "&ugrave;": "ù",
    "&uacute;": "ú",
    "&ucirc;": "û",
    "&uuml;": "ü",
    "&yacute;": "ý",
    "&thorn;": "þ",
    "&yuml;": "ÿ",

    // Currency symbols
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&curren;": "¤",

    // Other useful symbols
    "&laquo;": "«",
    "&raquo;": "»",
    "&not;": "¬",
    "&shy;": "­",
    "&macr;": "¯",
    "&acute;": "´",
    "&cedil;": "¸",
    "&ordm;": "º",
    "&ordf;": "ª",
    "&iquest;": "¿",
    "&iexcl;": "¡",
    "&brvbar;": "¦",
    "&uml;": "¨",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&oline;": "‾",
    "&frasl;": "⁄",
    "&weierp;": "℘",
    "&image;": "ℑ",
    "&real;": "ℜ",
    "&alefsym;": "ℵ",
    "&larr;": "←",
    "&uarr;": "↑",
    "&rarr;": "→",
    "&darr;": "↓",
    "&harr;": "↔",
    "&crarr;": "↵",
    "&lArr;": "⇐",
    "&uArr;": "⇑",
    "&rArr;": "⇒",
    "&dArr;": "⇓",
    "&hArr;": "⇔",
    "&hearts;": "♥",
    "&diams;": "♦",
    "&clubs;": "♣",
    "&spades;": "♠",
  };

  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    // Handle numeric entities like &#39;
    if (entity.startsWith("&#") && entity.endsWith(";")) {
      const num = parseInt(entity.slice(2, -1), 10);
      if (!isNaN(num)) {
        return String.fromCharCode(num);
      }
    }

    // Handle named entities
    return entities[entity] || entity;
  });
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
