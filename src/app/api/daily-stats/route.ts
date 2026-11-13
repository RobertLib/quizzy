import { NextRequest, NextResponse } from "next/server";
import { DAILY_QUESTION_COUNT, isLiveKey, isPlayableKey } from "@/lib/daily";
import { redis, redisEnabled, redisPipeline } from "@/lib/redis";
import type { DailyStats } from "@/lib/daily-stats";

const KEEP_SECONDS = 400 * 86_400;
const DEDUPE_SECONDS = 2 * 86_400;
/**
 * Devices behind one address (a household, an office, a phone network) each
 * count once, up to this many a day — so changing the User-Agent can't be
 * used to stuff the numbers.
 */
const MAX_RESULTS_PER_IP = 10;

const statsKey = (date: string) => `quizzy:daily:${date}`;

async function readStats(date: string): Promise<DailyStats> {
  const raw = (await redis(["HGETALL", statsKey(date)])) as string[] | null;
  const fields: Record<string, number> = {};
  for (let i = 0; raw && i < raw.length; i += 2) fields[raw[i]] = Number(raw[i + 1]);
  return {
    plays: fields.plays ?? 0,
    histogram: Array.from({ length: DAILY_QUESTION_COUNT + 1 }, (_, n) => fields[`c${n}`] ?? 0),
    perQuestion: Array.from({ length: DAILY_QUESTION_COUNT }, (_, i) => fields[`q${i}`] ?? 0),
  };
}

async function digest(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Buffer.from(bytes).toString("base64url").slice(0, 22);
}

/**
 * Hashed ids for one result: the address alone, and the address plus the
 * browser. Salted per day, so stored values can't be linked across days.
 */
async function visitorIds(request: NextRequest, date: string) {
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const agent = request.headers.get("user-agent") ?? "";
  return {
    address: await digest(`${date}:${ip}`),
    device: await digest(`${date}:${ip}:${agent}`),
  };
}

export async function GET(request: NextRequest) {
  if (!redisEnabled) return NextResponse.json({ enabled: false });
  const date = request.nextUrl.searchParams.get("date") ?? "";
  if (!isPlayableKey(date)) {
    return NextResponse.json({ error: "Unknown day" }, { status: 400 });
  }
  try {
    const stats = await readStats(date);
    return NextResponse.json(
      { enabled: true, ...stats },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch {
    return NextResponse.json({ enabled: false });
  }
}

/** Records one anonymous result: which of the day's questions were right. */
export async function POST(request: NextRequest) {
  if (!redisEnabled) return NextResponse.json({ enabled: false });

  let body: { date?: unknown; grid?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const date = typeof body.date === "string" ? body.date : "";
  const grid = typeof body.grid === "string" ? body.grid : "";
  // Only the day that is "today" somewhere can be submitted — archive replays
  // would skew the numbers with players who have seen the answers.
  if (!isLiveKey(date) || !new RegExp(`^[gyr]{${DAILY_QUESTION_COUNT}}$`).test(grid)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    const key = statsKey(date);
    const ids = await visitorIds(request, date);
    // One result per device per day; repeats just read the stats back.
    const fresh = await redis([
      "SET",
      `quizzy:seen:${date}:${ids.device}`,
      "1",
      "NX",
      "EX",
      DEDUPE_SECONDS,
    ]);
    let counted = false;
    if (fresh === "OK") {
      const addressKey = `quizzy:ip:${date}:${ids.address}`;
      const [fromAddress] = await redisPipeline([
        ["INCR", addressKey],
        ["EXPIRE", addressKey, DEDUPE_SECONDS],
      ]);
      counted = Number(fromAddress) <= MAX_RESULTS_PER_IP;
    }
    if (counted) {
      const correct = [...grid].filter((c) => c === "g").length;
      const commands: (string | number)[][] = [
        ["HINCRBY", key, "plays", 1],
        ["HINCRBY", key, `c${correct}`, 1],
      ];
      [...grid].forEach((c, i) => {
        if (c === "g") commands.push(["HINCRBY", key, `q${i}`, 1]);
      });
      commands.push(["EXPIRE", key, KEEP_SECONDS]);
      await redisPipeline(commands);
    }
    return NextResponse.json({ enabled: true, ...(await readStats(date)) });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}
