import type { Metadata } from "next";
import { connection } from "next/server";
import { Cormorant_Garamond, Open_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/data/settings";
import { getCategories } from "@/data/categories";

import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
});

// Editorial serif for the navbar and category/project titles.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings.photographer_name,
      template: `%s | ${settings.photographer_name}`,
    },
    description: `Photography portfolio of ${settings.photographer_name}`,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render every page per request so database changes show up without a rebuild.
  await connection();

  const [settings, categories] =
    await Promise.all([
      getSettings(),
      getCategories(),
    ]);

  return (
    <html
      lang="en"
      className={`${openSans.variable} ${cormorant.variable} h-full antialiased`}
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