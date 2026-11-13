import type { QuizApiResponse, QuizConfig, QuizQuestion } from "@/types/quiz";
import type { DailyStats } from "./daily-stats";

/**
 * Custom quizzes. The route handler already falls back to our own bank when
 * Open Trivia DB is down, so a failure here means the player is offline.
 */
export async function fetchQuizQuestions(
  amount: number,
  config: QuizConfig
): Promise<QuizApiResponse> {
  const params = new URLSearchParams({ amount: amount.toString() });
  if (config.difficulty !== "mixed") params.append("difficulty", config.difficulty);
  if (config.categories.length > 0) {
    params.append("categories", config.categories.join(","));
  }

  const response = await fetch(`/api/quiz?${params.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return (await response.json()) as QuizApiResponse;
}

export async function fetchDailyQuiz(key: string): Promise<QuizQuestion[]> {
  const response = await fetch(`/api/daily/${key}`);
  if (!response.ok) throw new Error(`Daily returned ${response.status}`);
  const data = (await response.json()) as { questions: QuizQuestion[] };
  return data.questions;
}

type StatsResponse = ({ enabled: true } & DailyStats) | { enabled: false };

function statsOf(data: StatsResponse): DailyStats | null {
  return data.enabled ? data : null;
}

export async function fetchDailyStats(key: string): Promise<DailyStats | null> {
  try {
    const response = await fetch(`/api/daily-stats?date=${key}`);
    if (!response.ok) return null;
    return statsOf((await response.json()) as StatsResponse);
  } catch {
    return null;
  }
}

const SUBMITTED_KEY = "quizzy:submitted:v1";

/**
 * Sends today's anonymous result once per device, then returns everyone's
 * numbers. Later calls (a remount, a second tab) only read.
 */
export async function submitDailyResult(
  key: string,
  grid: string
): Promise<DailyStats | null> {
  let already = false;
  try {
    already = window.localStorage.getItem(SUBMITTED_KEY) === key;
    window.localStorage.setItem(SUBMITTED_KEY, key);
  } catch {
    /* storage blocked — the server de-duplicates as well */
  }
  if (already) return fetchDailyStats(key);

  try {
    const response = await fetch("/api/daily-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: key, grid }),
    });
    if (!response.ok) return null;
    return statsOf((await response.json()) as StatsResponse);
  } catch {
    return null;
  }
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
