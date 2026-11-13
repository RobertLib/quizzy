/**
 * Minimal Upstash Redis REST client — no SDK needed for a handful of
 * commands. Works with the env vars Vercel's Upstash integration sets
 * (KV_REST_API_*) or Upstash's own names. Without them, stats are disabled
 * and the UI simply hides them.
 */
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisEnabled = Boolean(url && token);

type Command = (string | number)[];

export async function redisPipeline(commands: Command[]): Promise<unknown[]> {
  if (!url || !token) throw new Error("Redis is not configured");
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`Redis ${response.status}`);
  const results = (await response.json()) as { result?: unknown; error?: string }[];
  return results.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

export async function redis(command: Command): Promise<unknown> {
  const [result] = await redisPipeline([command]);
  return result;
}
