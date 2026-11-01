import type { Metadata } from "next";
import { connection } from "next/server";
import { Albert_Sans, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { env } from "@/lib/env";
import { siteIconUrl } from "@/lib/site-icon";
import { socialMetadata } from "@/lib/social-metadata";
import { getSettings } from "@/data/settings";
import { getCategories } from "@/data/categories";

import "./globals.css";

// Variable font: every weight is available. Used for all text except the logo.
const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin", "latin-ext"],
});

// Used only for the logo (photographer name).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const description = `Photography portfolio of ${settings.photographer_name}`;

  const favicon = settings.favicon;

  return {
    // The production URL already configured for auth; makes og:image URLs absolute.
    metadataBase: new URL(env.BETTER_AUTH_URL),
    title: {
      default: settings.photographer_name,
      template: `%s | ${settings.photographer_name}`,
    },
    description,
    // No favicon: no `icons` key at all, browsers show their default.
    ...(favicon && {
      icons: {
        icon: [{ url: siteIconUrl(favicon, 32), sizes: "32x32", type: "image/png" }],
        apple: [{ url: siteIconUrl(favicon, 180), sizes: "180x180", type: "image/png" }],
      },
    }),
    ...socialMetadata({
      siteName: settings.photographer_name,
      title: settings.photographer_name,
      description,
      image: settings.homepage_images?.[0],
    }),
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
      className={`${albertSans.variable}${montserrat.variable} h-full antialiased`}
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

        <Footer
          photographerName={
            settings.photographer_name
          }
        />
      </body>
    </html>
  );
}