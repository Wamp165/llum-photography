import Navbar from "@/components/Navbar";
import ImageCarousel from "@/components/ImageCarousel";

import { getSettings } from "@/data/settings";
import { getCategories } from "@/data/categories";

export default async function Home() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar
        photographerName={settings.photographer_name}
        categories={categories}
      />

      <main>
        <ImageCarousel
          images={settings.homepage_images ?? []}
        />
      </main>
    </>
  );
}