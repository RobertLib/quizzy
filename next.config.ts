import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The longest a cached ISR page may be served stale, in seconds. Topic
   * pages hide the questions of live dailies as of the moment they were
   * rendered (see unrevealedDailyIds), which only holds while a page is less
   * than two days old — Next's default of a year would let a page nobody has
   * visited for days show today's answers to its next visitor.
   */
  expireTime: 12 * 3600,
};

export default nextConfig;
