import ImageCarousel from "@/components/ImageCarousel";
import { getSettings } from "@/data/settings";

export default async function Home() {
  const settings = await getSettings();

  return (
    <div className="site-container">
      <h1 className="sr-only">{settings.photographer_name}</h1>
      <ImageCarousel
        images={settings.homepage_images ?? []}
        altLabel={settings.photographer_name}
        showTotal
        lightbox={false}
        lcp
      />
    </div>
  );
}
