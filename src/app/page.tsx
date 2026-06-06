import ImageCarousel from "@/components/ImageCarousel";
import { getSettings } from "@/data/settings";

export default async function Home() {
  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-[1400px] px-8">
      <ImageCarousel
        images={settings.homepage_images ?? []}
      />
    </main>
  );
}