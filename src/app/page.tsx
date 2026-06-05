import { getSettings } from "@/data/settings";
import { getCategories } from "@/data/categories";

export default async function Home() {
  const settings = await getSettings();
  const categories = await getCategories();

  return (
    <main>
      <h1>{settings.photographer_name}</h1>

      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
          </li>
        ))}
      </ul>
    </main>
  );
}