import TopicsScreen, { topicsMetadata } from "@/screens/TopicsScreen";

// Counts match the topic pages, which change as dailies go live.
export const revalidate = 3600;

export const metadata = topicsMetadata("cs");

export default function Page() {
  return <TopicsScreen locale="cs" />;
}
