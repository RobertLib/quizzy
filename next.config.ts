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
  experimental: {
    /**
     * Each language has its own root layout, so there is no app-wide layout
     * for an unmatched URL's 404 — app/global-not-found.tsx stands in for it.
     * Unmatched /cs/… paths are caught by app/(cs)/cs/[...missing] instead.
     */
    globalNotFound: true,
  },
};

export default nextConfig;
