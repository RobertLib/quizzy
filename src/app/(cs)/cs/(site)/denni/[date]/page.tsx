import type { Metadata } from "next";
import DayScreen, { dayMetadata, dayStaticParams } from "@/screens/DayScreen";

// A day flips from "live" to "answers published" without a deploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return dayStaticParams();
}

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return dayMetadata("cs", (await params).date);
}

export default async function Page({ params }: Props) {
  return <DayScreen locale="cs" date={(await params).date} />;
}
