import type { Metadata } from "next";
import TopicScreen, { topicMetadata, topicStaticParams } from "@/screens/TopicScreen";

export const dynamicParams = false;

// Questions in a live daily are left out until their answers are published,
// so the list changes as the days roll over.
export const revalidate = 3600;

export function generateStaticParams() {
  return topicStaticParams("cs");
}

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return topicMetadata("cs", (await params).category);
}

export default async function Page({ params }: Props) {
  return <TopicScreen locale="cs" slug={(await params).category} />;
}
