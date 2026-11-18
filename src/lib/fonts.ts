import { Geist } from "next/font/google";

/** latin-ext carries the Czech letters (ě, š, č, ř, ž, ů). */
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});
