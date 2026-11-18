import EmbedDailyScreen, { embedMetadata } from "@/screens/EmbedDailyScreen";

export const metadata = embedMetadata("en");

export default function Page() {
  return <EmbedDailyScreen locale="en" />;
}
