// Minimal fake data for CI: npm run db:seed:ci
//
// Fills the settings row and adds one category with a published project and one block,
// through the data layer. Safe to run twice (it does nothing if the category exists).

const image = (name: string) => `https://res.cloudinary.com/demo/image/upload/${name}.jpg`;

async function main() {
  const { sql } = await import("@/lib/db");
  try {
    const { updateSettings } = await import("@/data/settings");
    const { createCategory, getCategoryBySlug } = await import("@/data/categories");
    const { createProject, updateProject, setProjectPublished } = await import("@/data/projects");
    const { createProjectBlock } = await import("@/data/project-blocks");

    await updateSettings({
      photographer_name: "CI Photographer",
      bio: "Fake bio used by the CI seed.",
      profile_picture: image("sample"),
      instagram: null,
      substack: null,
      contact_email: "ci@example.com",
      location: "Test City",
      homepage_images: [image("sample")],
    });

    if (await getCategoryBySlug("ci-category")) {
      console.log("Seed data already present.");
      return;
    }

    const categoryId = await createCategory({ name: "CI category", slug: "ci-category", layout: "grid" });
    const projectId = await createProject("CI project", categoryId);
    await updateProject(projectId, {
      title: "CI project",
      slug: "ci-project",
      category_id: categoryId,
      description: "Fake project for CI.",
      introduction: "Fake introduction.",
      cover_image: image("sample"),
      project_date: "2024-01-01",
    });
    await createProjectBlock(projectId, {
      type: "only_text_center",
      content: { text: "Fake block for CI." },
    });
    await setProjectPublished(projectId, true);
    console.log("Seeded: settings, 1 category, 1 published project with 1 block.");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
