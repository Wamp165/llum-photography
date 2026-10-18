import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import ActionButton from "@/components/admin/ActionButton";
import Thumbnail from "@/components/admin/Thumbnail";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/categories";
import { getAdminProjects } from "@/data/projects";
import { requireAdmin } from "@/lib/auth-guard";
import { moveProjectAction } from "./actions";
import NewProjectForm from "./NewProjectForm";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  await requireAdmin();
  const [categories, projects] = await Promise.all([getCategories(), getAdminProjects()]);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-xl font-semibold">Projects</h1>

      <Card className="mb-10">
        <CardHeader>
          <CardTitle className="text-base">New project</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Create a category first in{" "}
              <Link href="/admin/categories" className="underline">
                Categories
              </Link>
              .
            </p>
          ) : (
            <NewProjectForm categories={categories} />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-10">
        {categories.map((category) => {
          const inCategory = projects.filter((project) => project.category_id === category.id);

          return (
            <section key={category.id}>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {category.name}
              </h2>

              {inCategory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects.</p>
              ) : (
                <ol className="divide-y rounded-lg border">
                  {inCategory.map((project, index) => (
                    <li key={project.id} className="flex items-center gap-3 p-3">
                      <Thumbnail url={project.cover_image} alt={project.title} size="sm" />

                      <div className="grid min-w-0 flex-1 gap-1">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="truncate text-sm font-medium hover:underline"
                        >
                          {project.title}
                        </Link>
                        <div>
                          <Badge variant={project.is_published ? "secondary" : "outline"}>
                            {project.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <ActionButton
                          action={moveProjectAction.bind(null, project.id, "up")}
                          disabled={index === 0}
                          size="icon"
                          ariaLabel="Move up"
                        >
                          <ArrowUp />
                        </ActionButton>
                        <ActionButton
                          action={moveProjectAction.bind(null, project.id, "down")}
                          disabled={index === inCategory.length - 1}
                          size="icon"
                          ariaLabel="Move down"
                        >
                          <ArrowDown />
                        </ActionButton>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
