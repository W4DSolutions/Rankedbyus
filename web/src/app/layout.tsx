import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RankedByUs - The Internet's Safest Community-Ranked Recommendations",
  description: "Discover the best AI tools, apps, and services ranked by real users. No spam, no chaos - just trusted recommendations.",
  keywords: ["rankings", "best tools", "AI tools", "user reviews", "community recommendations"],
  openGraph: {
    title: "RankedByUs - Community-Ranked Recommendations",
    description: "Discover the best AI tools, apps, and services ranked by real users.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
