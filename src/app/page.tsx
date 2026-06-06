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

      <main className="mx-auto max-w-[1400px] px-8">
        <ImageCarousel
          images={settings.homepage_images ?? []}
        />
      </main>
    </>
  );
}