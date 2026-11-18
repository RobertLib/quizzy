import type { Metadata } from "next";
import ChallengeScreen, { challengeMetadata, type ChallengeParams } from "@/screens/ChallengeScreen";

type Props = { params: ChallengeParams };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return challengeMetadata("cs", params);
}

export default function Page({ params }: Props) {
  return <ChallengeScreen locale="cs" params={params} />;
}
