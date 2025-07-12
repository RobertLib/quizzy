import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quizzy — Trivia with streaks and a daily challenge",
    short_name: "Quizzy",
    description:
      "Fast trivia rounds with streak multipliers, levels, badges and a daily challenge",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a17",
    theme_color: "#7b4ce0",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        // Full-bleed variant: Android crops maskable icons to its own shape.
        src: "/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["education", "entertainment", "games"],
    lang: "en-US",
    dir: "ltr",
  };
}
