import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Promptify",
  description: "Generator promptów AI dla DALL-E, Midjourney i Flux",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={cn(spaceGrotesk.variable, dmSans.variable, GeistSans.variable, "dark font-sans")}
    >
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
