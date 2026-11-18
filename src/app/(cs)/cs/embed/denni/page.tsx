import EmbedDailyScreen, { embedMetadata } from "@/screens/EmbedDailyScreen";

export const metadata = embedMetadata("cs");

export default function Page() {
  return <EmbedDailyScreen locale="cs" />;
}
