import DailyScreen, { dailyMetadata } from "@/screens/DailyScreen";

// The archive grows by a day at a time.
export const revalidate = 3600;

export const metadata = dailyMetadata("en");

export default function Page() {
  return <DailyScreen locale="en" />;
}
