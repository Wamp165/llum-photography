import { getSettings } from "@/data/settings";
import { getCategories } from "@/data/categories";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(),
  ]);

  return (
    <main>
      <Navbar
        photographerName={settings.photographer_name}
        categories={categories}
      />
    </main>
  );
}