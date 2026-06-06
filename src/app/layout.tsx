import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/data/settings";
import { getCategories } from "@/data/categories";

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
  title: "Llum Photography",
  description: "Photography portfolio",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] =
    await Promise.all([
      getSettings(),
      getCategories(),
    ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar
          photographerName={
            settings.photographer_name
          }
          categories={categories}
        />

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}