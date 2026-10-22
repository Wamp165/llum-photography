import type { Metadata } from "next";
import { cloudinaryShareImageUrl } from "./cloudinary-url";

type SocialInput = {
  siteName: string;
  title: string;
  description?: string | null;
  image?: string | null;
};

// A page's `openGraph` / `twitter` replace the layout's entirely (no deep merge),
// so every page builds the full objects through this helper.
export function socialMetadata({
  siteName,
  title,
  description,
  image,
}: SocialInput): Pick<Metadata, "openGraph" | "twitter"> {
  const images = image ? [cloudinaryShareImageUrl(image)] : undefined;

  return {
    openGraph: {
      type: "website",
      siteName,
      title,
      description: description ?? undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images,
    },
  };
}

/** First `max` characters, cut at a word boundary. */
export function excerpt(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
