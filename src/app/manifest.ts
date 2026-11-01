import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getSettings } from "@/data/settings";
import { siteIconUrl } from "@/lib/site-icon";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Read per request, like the site layout, so the build needs no database.
  await connection();

  const base = {
    start_url: "/",
    display: "browser" as const,
    background_color: "#ffffff",
    theme_color: "#ffffff",
  };

  try {
    const settings = await getSettings();
    const favicon = settings.favicon;
    return {
      ...base,
      name: settings.photographer_name,
      short_name: settings.photographer_name,
      icons: favicon
        ? ([192, 512] as const).map((size) => ({
            src: siteIconUrl(favicon, size),
            sizes: `${size}x${size}`,
            type: "image/png",
          }))
        : [],
    };
  } catch (error) {
    console.error("Manifest: could not read settings", error);
    return { ...base, name: "Portfolio", short_name: "Portfolio", icons: [] };
  }
}
