import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ActionButton from "@/components/admin/ActionButton";
import AddBlock from "@/components/admin/blocks/AddBlock";
import BlockListItem from "@/components/admin/blocks/BlockListItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/data/categories";
import { getAdminProjectBlocks } from "@/data/project-blocks";
import { getProjectById } from "@/data/projects";
import { requireAdmin } from "@/lib/auth-guard";
import {
  createBlockAction,
  deleteBlockAction,
  deleteProjectAction,
  moveBlockAction,
  setPublishedAction,
  updateBlockAction,
  updateProjectAction,
} from "./actions";
import ProjectForm from "./ProjectForm";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Edit project",
};

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [project, categories, blocks] = await Promise.all([
    getProjectById(id),
    getCategories(),
    getAdminProjectBlocks(id),
  ]);
  if (!project) notFound();

  const publicPath = `/${project.category_slug}/${project.slug}`;

  return (
    <div className="max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
        <Link href="/admin/projects">
          <ArrowLeft /> Projects
        </Link>
      </Button>

      <header className="mt-4 mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="text-xl font-semibold">{project.title}</h1>
          <div>
            <Badge variant={project.is_published ? "secondary" : "outline"}>
              {project.is_published ? "Published" : "Draft — not visible on the site"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={publicPath} target="_blank" rel="noreferrer">
              Preview <ExternalLink />
            </a>
          </Button>
          <ActionButton
            action={setPublishedAction.bind(null, project.id, !project.is_published)}
            variant={project.is_published ? "outline" : "default"}
            successMessage={project.is_published ? "Unpublished" : "Published"}
          >
            {project.is_published ? "Unpublish" : "Publish"}
          </ActionButton>
        </div>
      </header>

      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        project={project}
        categories={categories}
      />

      <Separator className="my-12" />

      <section>
        <h2 className="mb-1 text-base font-semibold">Content blocks</h2>
        <p className="mb-6 text-sm text-muted-foreground">Shown below the introduction, in this order.</p>

        {blocks.length === 0 && <p className="mb-6 text-sm text-muted-foreground">No blocks yet.</p>}

        <ol className="mb-6 grid gap-4">
          {blocks.map((entry, index) => {
            const blockId = entry.valid ? entry.block.id : entry.row.id;
            return (
              <BlockListItem
                key={blockId}
                entry={entry}
                index={index}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
                updateAction={updateBlockAction.bind(null, blockId)}
                deleteAction={deleteBlockAction.bind(null, blockId)}
                moveUpAction={moveBlockAction.bind(null, blockId, "up")}
                moveDownAction={moveBlockAction.bind(null, blockId, "down")}
              />
            );
          })}
        </ol>

        <AddBlock action={createBlockAction.bind(null, project.id)} />
      </section>

      <Separator className="my-12" />

      <section className="grid gap-3">
        <h2 className="text-base font-semibold">Delete project</h2>
        <p className="text-sm text-muted-foreground">
          Deletes the project and all its blocks. This cannot be undone.
        </p>
        <div>
          <ActionButton
            action={deleteProjectAction.bind(null, project.id)}
            variant="destructive"
            confirm={{
              title: `Delete "${project.title}"?`,
              description: "The project and all its blocks will be deleted. This cannot be undone.",
              confirmLabel: "Delete project",
            }}
          >
            Delete project
          </ActionButton>
        </div>
      </section>
    </div>
  );
}
