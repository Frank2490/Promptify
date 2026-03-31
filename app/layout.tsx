import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Promptify",
  description: "Transform your ideas into powerful AI prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
