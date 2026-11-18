import HomeScreen, { homeMetadata } from "@/screens/HomeScreen";

export const metadata = homeMetadata("cs");

export default function Page() {
  return <HomeScreen locale="cs" />;
}
