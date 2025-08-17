import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import { Providers } from "./providers";
import UserMenu from "@/components/UserMenu";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quixz",
    template: "%s · Quixz",
  },
  description: "Compact, AI-powered quiz platform for rapid learning.",
  metadataBase: new URL("https://quizx-5z2.pages.dev"),
  openGraph: {
    type: "website",
    siteName: "Quixz",
    images: [{ url: "/OG-alt.webp", width: 1200, height: 630, alt: "Quixz" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/twitter.webp" }],
  },
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp", sizes: "32x32" },
      { url: "/favicon.webp", type: "image/webp", sizes: "16x16" },
    ],
    shortcut: [
      { url: "/favicon.webp", type: "image/webp" },
    ],
    apple: "/brand.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased motion-ok`}>
        <Providers>
          <UserMenu />
          {/* global hero background on every page */}
          <div className="hero-background fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
            <div className="hero-lights w-full h-full" />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
