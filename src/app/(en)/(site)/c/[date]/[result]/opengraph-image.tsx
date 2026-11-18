import { challengeImage, type ChallengeParams } from "@/screens/ChallengeScreen";

// Next reads these three as static exports, so they can't be imported.
export const alt = "A friend's Quizzy daily trivia score — can you beat it?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: ChallengeParams }) {
  return challengeImage("en", params);
}
