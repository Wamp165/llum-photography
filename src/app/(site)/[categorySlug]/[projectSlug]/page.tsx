import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import { getCurrentAdmin } from "@/lib/auth-guard";
import { getProjectBlocks } from "@/data/project-blocks";
import { formatProjectDate } from "@/lib/format-date";
import BlockRenderer from "@/components/project-blocks/BlockRenderer";

type Props = {
  params: Promise<{
    categorySlug: string;
    projectSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { categorySlug, projectSlug } = await params;
  const admin = await getCurrentAdmin();
  const project = await getProjectBySlug(categorySlug, projectSlug, admin !== null);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description ?? undefined,
    robots: project.is_published ? undefined : { index: false, follow: false },
  };
}

export default async function ProjectPage({
  params,
}: Props) {
  const { categorySlug, projectSlug } = await params;
  // Drafts are visible only to the logged-in admin (for previewing).
  const admin = await getCurrentAdmin();
  const project = await getProjectBySlug(categorySlug, projectSlug, admin !== null);

  if (!project) {
    notFound();
  }

  const blocks = await getProjectBlocks(project.id);

  return (
    <article className="mx-auto max-w-[1400px] px-8 pb-24">
      {!project.is_published && (
        <p className="mt-4 border-y border-neutral-200 py-2 text-center text-xs uppercase tracking-wide text-neutral-500">
          Draft — not public
        </p>
      )}

      {project.cover_image && (
        <div className="mt-12 flex justify-center">
          <Image
            src={project.cover_image}
            alt={project.title}
            width={1800}
            height={1200}
            sizes="(max-width: 1400px) 100vw, 1400px"
            preload
            className="h-auto max-h-[75vh] w-auto"
          />
        </div>
      )}

      <header className="mx-auto mt-8 max-w-3xl">
        <h1 className="mb-2 text-xl font-medium">
          {project.title}
        </h1>

        {project.project_date && (
          <p className="mb-8 text-sm text-neutral-500">
            <time dateTime={project.project_date}>
              {formatProjectDate(project.project_date)}
            </time>
          </p>
        )}

        {project.introduction && (
          <p className="whitespace-pre-line leading-8">
            {project.introduction}
          </p>
        )}
      </header>

      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
        />
      ))}
    </article>
  );
}
