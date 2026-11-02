import HomeHero from "@/components/HomeHero";
import { getSettings } from "@/data/settings";

export default async function Home() {
  const settings = await getSettings();

  return (
    <>
      <h1 className="sr-only">{settings.photographer_name}</h1>
      <HomeHero
        images={settings.homepage_images ?? []}
        altLabel={settings.photographer_name}
      />
    </>
  );
}
