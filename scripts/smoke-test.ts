// Smoke test against a THROWAWAY database: npm run test:smoke
//
// Creates a temporary database next to DATABASE_URL's (needs CREATE DATABASE, so
// it only runs against a local PostgreSQL), applies every migration, runs the
// checks below, and always drops the database at the end.

import { spawnSync } from "node:child_process";
import path from "node:path";
import postgres from "postgres";

type Check = { name: string; run: () => Promise<void> | void };

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "::1", "[::1]"];

async function main() {
  const originalUrl = process.env.DATABASE_URL;
  assert(originalUrl, "DATABASE_URL is not set (check .env.local).");

  const adminUrl = new URL(originalUrl);
  assert(LOCAL_HOSTS.includes(adminUrl.hostname), "The smoke test only runs against a local PostgreSQL.");
  adminUrl.pathname = "/postgres";

  const testDbName = `llum_smoke_${process.pid}`;
  const testUrl = new URL(originalUrl);
  testUrl.pathname = `/${testDbName}`;

  const admin = postgres(adminUrl.href, { onnotice: () => {} });
  await admin.unsafe(`CREATE DATABASE ${testDbName}`);

  let appSql: postgres.Sql | undefined;
  let failed = 0;

  try {
    const migrate = spawnSync(process.execPath, [path.join("scripts", "migrate.mjs")], {
      env: { ...process.env, DATABASE_URL: testUrl.href },
      encoding: "utf8",
    });
    assert(migrate.status === 0, `Migrations failed:\n${migrate.stderr}${migrate.stdout}`);

    // src/lib/env.ts reads process.env when first imported: point it at the test DB.
    process.env.DATABASE_URL = testUrl.href;

    const { sql } = await import("@/lib/db");
    appSql = sql;
    const constants = await import("@/lib/constants");
    const blockSchemas = await import("@/lib/schemas/project-block");
    const { settingsFormSchema } = await import("@/lib/schemas/settings");
    const { categoryFormSchema } = await import("@/lib/schemas/category");
    const { projectFormSchema } = await import("@/lib/schemas/project");
    const { isCloudinaryImageUrl, isSlug } = await import("@/lib/schemas/common");
    const { slugify } = await import("@/lib/slugify");
    const categories = await import("@/data/categories");
    const projects = await import("@/data/projects");
    const blocks = await import("@/data/project-blocks");
    const { isUniqueViolation } = await import("@/data/errors");

    // The migrations create the settings row: a fresh deploy must not crash on getSettings().
    const [seeded] = await sql`SELECT 1 FROM settings WHERE id = 1`;
    assert(seeded, "The migrations did not create the settings row.");

    const image = (name: string) => `https://res.cloudinary.com/demo/image/upload/${name}.jpg`;
    const form = (values: Record<string, string>) => {
      const data = new FormData();
      for (const [key, value] of Object.entries(values)) data.set(key, value);
      return Object.fromEntries(data);
    };

    let projectId = 0;
    let secondId = 0;
    let categoryId = 0;

    const checks: Check[] = [
      // --- Zod schemas ------------------------------------------------------
      {
        name: "valid blocks of every type pass",
        run: () => {
          const samples = {
            only_text_center: { text: "Hello" },
            image_gallery: { images: [image("a"), image("b")] },
            carousel: { images: [image("a")] },
            image_left_text_right: { image: image("a"), text: "t" },
            image_right_text_left: { image: image("a"), text: "t" },
            image_center_text_above: { image: image("a"), text: "t" },
            image_center_text_below: { image: image("a"), text: "t" },
          };
          for (const type of constants.BLOCK_TYPES) {
            const result = blockSchemas.projectBlockSchema.safeParse({ type, content: samples[type] });
            assert(result.success, `${type} rejected`);
          }
        },
      },
      {
        name: "invalid blocks are rejected",
        run: () => {
          const bad = [
            { type: "video", content: {} },
            { type: "only_text_center", content: { text: "   " } },
            { type: "only_text_center", content: "not an object" },
            { type: "carousel", content: { images: [] } },
            { type: "image_left_text_right", content: { image: image("a") } },
          ];
          for (const block of bad) {
            assert(!blockSchemas.projectBlockSchema.safeParse(block).success, `accepted ${JSON.stringify(block)}`);
          }
        },
      },
      {
        name: "isSlug accepts real slugs and rejects probe paths",
        run: () => {
          for (const ok of ["nordic-light", "old_slug"]) assert(isSlug(ok), `rejected ${ok}`);
          const bad = ["wp-login.php", ".env", "xmlrpc.php", "Nordic", "a--b", "a".repeat(101)];
          for (const value of bad) assert(!isSlug(value), `accepted ${value}`);
        },
      },
      {
        name: "gallery: 1 to 3 images when saving, more still readable",
        run: () => {
          const four = { type: "image_gallery", content: { images: ["a", "b", "c", "d"].map(image) } };
          assert(!blockSchemas.projectBlockSchema.safeParse(four).success, "4 images accepted on save");
          assert(blockSchemas.storedProjectBlockSchema.safeParse(four).success, "4 images rejected on read");
        },
      },
      {
        name: "non-Cloudinary image URLs are rejected",
        run: () => {
          for (const url of [
            "http://res.cloudinary.com/x.jpg",
            "https://evil.example/x.jpg",
            "https://res.cloudinary.com.evil.example/x.jpg",
            "javascript:alert(1)",
          ]) {
            assert(!isCloudinaryImageUrl(url), `accepted ${url}`);
          }
          assert(isCloudinaryImageUrl(image("ok")), "rejected a valid URL");
          const settings = settingsFormSchema.safeParse(
            form({
              photographer_name: "X",
              profile_picture: "https://evil.example/x.jpg",
              homepage_images: JSON.stringify(["https://evil.example/y.jpg"]),
            })
          );
          assert(!settings.success, "settings accepted foreign URLs");
        },
      },
      {
        name: "settings schema: substack name",
        run: () => {
          const parse = (value: string) => settingsFormSchema.shape.substack.safeParse(value);
          const empty = parse("");
          assert(empty.success && empty.data === null, "empty substack should be null");
          for (const value of ["zuzanna", "Zuzanna.substack.com", "https://zuzanna.substack.com/"]) {
            const result = parse(value);
            assert(result.success && result.data === "zuzanna", `substack ${value} not normalised`);
          }
          assert(!parse("zu zanna").success, "substack with a space accepted");
        },
      },
      {
        name: "form schemas: block JSON, dates, slugs, reserved slugs",
        run: () => {
          const block = blockSchemas.blockFormSchema.safeParse(
            form({ type: "only_text_center", content: JSON.stringify({ text: "Hi", extra: 1 }) })
          );
          assert(block.success && !("extra" in block.data.content), "block form parse");
          assert(!blockSchemas.blockFormSchema.safeParse(form({ type: "only_text_center", content: "{" })).success, "bad JSON accepted");

          const project = projectFormSchema.safeParse(
            form({ title: "T", slug: "Bad Slug", category_id: "1", project_date: "2023-02-30" })
          );
          assert(!project.success, "bad slug/date accepted");
          const fields = new Set(project.error.issues.map((issue) => issue.path[0]));
          assert(fields.has("slug") && fields.has("project_date"), `issues: ${[...fields].join(",")}`);

          const ok = projectFormSchema.safeParse(form({ title: "T", slug: "my_little_war", category_id: "1", project_date: "" }));
          assert(ok.success && ok.data.project_date === null && ok.data.description === null, "valid project rejected");

          assert(!categoryFormSchema.safeParse(form({ name: "A", slug: "admin", layout: "grid" })).success, "reserved slug accepted");
          assert(!categoryFormSchema.safeParse(form({ name: "A", slug: "a", layout: "list" })).success, "unknown layout accepted");
          assert(slugify("  Fotografía Nórdica, 2024! ") === "fotografia-nordica-2024", "slugify");
        },
      },

      // --- Data layer: projects ---------------------------------------------
      {
        name: "create projects (drafts, unique slugs, positions 1..n)",
        run: async () => {
          categoryId = await categories.createCategory({ name: "Smoke", slug: "smoke", layout: "grid" });
          projectId = await projects.createProject("Nórdica Luz", categoryId);
          secondId = await projects.createProject("Nórdica Luz", categoryId);
          const first = await projects.getProjectById(projectId);
          const second = await projects.getProjectById(secondId);
          assert(first && second, "not created");
          assert(first.slug === "nordica-luz" && second.slug === "nordica-luz-2", `${first.slug} / ${second.slug}`);
          assert(!first.is_published && first.position === 1 && second.position === 2, "draft/positions");
        },
      },
      {
        name: "drafts hidden from public reads; visible with includeDrafts",
        run: async () => {
          assert((await projects.getProjectsByCategory("smoke")).length === 0, "draft listed");
          const inSitemap = (await projects.getPublishedProjectsForSitemap()).filter((p) => p.category_slug === "smoke");
          assert(inSitemap.length === 0, "draft in sitemap");
          assert((await projects.getProjectBySlug("smoke", "nordica-luz", false)) === null, "draft visible");
          assert((await projects.getProjectBySlug("smoke", "nordica-luz", true)) !== null, "admin preview");
          await projects.setProjectPublished(projectId, true);
          assert((await projects.getProjectsByCategory("smoke")).length === 1, "published not listed");
          const published = (await projects.getPublishedProjectsForSitemap()).filter((p) => p.category_slug === "smoke");
          assert(published.length === 1 && published[0].slug === "nordica-luz", "published not in sitemap");
          assert(/^\d{4}-\d{2}-\d{2}T[\d:]{8}Z$/.test(published[0].updated_at), `bad date ${published[0].updated_at}`);
        },
      },
      {
        name: "edit project; duplicate slug is a unique violation (23505)",
        run: async () => {
          const input = {
            title: "Edited",
            slug: "edited",
            category_id: categoryId,
            description: "d",
            introduction: null,
            cover_image: image("cover"),
            project_date: "2024-02-29",
          };
          await projects.updateProject(projectId, input);
          const edited = await projects.getProjectById(projectId);
          assert(edited?.title === "Edited" && edited.project_date === "2024-02-29", JSON.stringify(edited));

          let caught: unknown;
          try {
            await projects.updateProject(secondId, { ...input, title: "Other" });
          } catch (error) {
            caught = error;
          }
          assert(isUniqueViolation(caught), "no 23505 for a duplicate slug");
        },
      },
      {
        name: "reorder projects (swap, no moving past the edge)",
        run: async () => {
          await projects.moveProject(secondId, "up");
          assert((await projects.getProjectById(secondId))?.position === 1, "move up");
          await projects.moveProject(secondId, "up");
          assert((await projects.getProjectById(secondId))?.position === 1, "moved past the top");
          assert((await projects.getProjectById(projectId))?.position === 2, "neighbour");
        },
      },
      {
        name: "category with projects can't be deleted",
        run: async () => {
          assert((await categories.deleteCategory(categoryId)) === false, "deleted a category with projects");
        },
      },

      // --- Data layer: blocks -----------------------------------------------
      {
        name: "create, edit, reorder and delete blocks",
        run: async () => {
          const text = blockSchemas.projectBlockSchema.parse({ type: "only_text_center", content: { text: "Hello" } });
          const gallery = blockSchemas.projectBlockSchema.parse({ type: "image_gallery", content: { images: [image("a")] } });
          const textId = await blocks.createProjectBlock(projectId, text);
          const galleryId = await blocks.createProjectBlock(projectId, gallery);

          await blocks.moveProjectBlock(galleryId, "up");
          let list = await blocks.getProjectBlocks(projectId);
          assert(list[0].id === galleryId && list[1].id === textId, "reorder");

          await blocks.updateProjectBlock(textId, { type: "only_text_center", content: { text: "Bye" } });
          list = await blocks.getProjectBlocks(projectId);
          const edited = list[1];
          assert(edited.type === "only_text_center" && edited.content.text === "Bye", "edit");

          await blocks.deleteProjectBlock(galleryId);
          list = await blocks.getProjectBlocks(projectId);
          assert(list.length === 1 && list[0].position === 1, "delete + renumber");
        },
      },
      {
        name: "invalid stored block is skipped publicly, flagged in the admin",
        run: async () => {
          await sql`
            INSERT INTO project_blocks (project_id, type, content, position)
            VALUES (${projectId}, 'carousel', ${sql.json({ images: ["https://evil.example/x.jpg"] })}, 9)
          `;
          const originalError = console.error;
          console.error = () => {};
          const publicBlocks = await blocks.getProjectBlocks(projectId);
          console.error = originalError;
          const adminBlocks = await blocks.getAdminProjectBlocks(projectId);
          assert(publicBlocks.length === 1, "invalid block rendered");
          assert(adminBlocks.length === 2 && adminBlocks.some((block) => !block.valid), "not flagged");
        },
      },
      {
        name: "unknown block type is skipped publicly, flagged in the admin",
        run: async () => {
          await sql`
            INSERT INTO project_blocks (project_id, type, content, position)
            VALUES (${projectId}, 'video', ${sql.json({ url: "x" })}, 10)
          `;
          const originalError = console.error;
          console.error = () => {};
          const publicBlocks = await blocks.getProjectBlocks(projectId);
          console.error = originalError;
          const adminBlocks = await blocks.getAdminProjectBlocks(projectId);
          assert(publicBlocks.length === 1, "unknown block rendered");
          assert(
            adminBlocks.length === 3 && adminBlocks.filter((block) => !block.valid).length === 2,
            "unknown type not flagged"
          );
        },
      },
      {
        name: "category with an unknown layout is read back as editorial",
        run: async () => {
          const [row] = await sql<{ id: number }[]>`
            INSERT INTO categories (name, slug, layout, position)
            VALUES ('Legacy', 'legacy', 'list', 99)
            RETURNING id
          `;
          assert((await categories.getCategoryBySlug("legacy"))?.layout === "editorial", "getCategoryBySlug");
          assert((await categories.getCategories()).find((c) => c.slug === "legacy")?.layout === "editorial", "getCategories");
          const admin = (await categories.getCategoriesWithProjectCount()).find((c) => c.slug === "legacy");
          assert(admin?.layout === "editorial", "getCategoriesWithProjectCount");
          assert((await categories.deleteCategory(row.id)) === true, "cleanup");
        },
      },
      {
        name: "deleting a project deletes its blocks (CASCADE) and renumbers",
        run: async () => {
          await projects.deleteProject(projectId);
          assert((await projects.getProjectById(projectId)) === null, "still exists");
          const [{ count }] = await sql<{ count: number }[]>`
            SELECT count(*)::int AS count FROM project_blocks WHERE project_id = ${projectId}
          `;
          assert(count === 0, "blocks left behind");
          assert((await projects.getProjectById(secondId))?.position === 1, "not renumbered");
        },
      },
    ];

    for (const check of checks) {
      try {
        await check.run();
        console.log(`  ok   ${check.name}`);
      } catch (error) {
        failed++;
        console.log(`  FAIL ${check.name}\n       ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    console.log(`\n${checks.length - failed} passed, ${failed} failed`);
  } finally {
    await appSql?.end();
    await admin.unsafe(`DROP DATABASE IF EXISTS ${testDbName} WITH (FORCE)`);
    await admin.end();
  }

  return failed;
}

main()
  .then((failed) => process.exit(failed > 0 ? 1 : 0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
