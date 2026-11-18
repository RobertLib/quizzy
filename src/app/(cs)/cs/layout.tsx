import type { Metadata, Viewport } from "next";
import RootDocument, { rootMetadata, rootViewport } from "@/components/RootDocument";

export const viewport: Viewport = rootViewport;
export const metadata: Metadata = rootMetadata("cs");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="cs">{children}</RootDocument>;
}
