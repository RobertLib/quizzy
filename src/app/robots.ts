import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Challenge (/c/, /cs/vyzva/) and embed pages stay crawlable on purpose: link-preview
      // bots honour robots.txt, and those pages carry noindex instead.
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
