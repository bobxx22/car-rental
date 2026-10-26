import type { Metadata, Viewport } from "next";
import { Geologica, Inter } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin", "cyrillic"] });
const heading = Geologica({ variable: "--font-heading", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.type} ${site.cityIn}`, template: `%s — ${site.name}` },
  description: `${site.tagline}. ${site.lead}`,
  openGraph: { title: `${site.name} — ${site.type}`, description: site.tagline, locale: "uk_UA", type: "website" },
};

export const viewport: Viewport = { themeColor: "#f3f3f0" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={`${body.variable} ${heading.variable} antialiased`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
