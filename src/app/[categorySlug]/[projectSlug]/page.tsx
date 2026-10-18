import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
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
  const project = await getProjectBySlug(categorySlug, projectSlug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.description ?? undefined,
  };
}

export default async function ProjectPage({
  params,
}: Props) {
  const { categorySlug, projectSlug } = await params;
  const project = await getProjectBySlug(categorySlug, projectSlug);

  if (!project) {
    notFound();
  }

  const blocks = await getProjectBlocks(project.id);

  return (
    <article className="site-container pb-24">
      {project.cover_image && (
        <Image
          src={project.cover_image}
          alt={project.title}
          width={2000}
          height={1333}
          sizes="(max-width: 1100px) 100vw, 1020px"
          preload
          className="h-auto max-h-[85vh] w-full object-contain"
        />
      )}

      <header className="mt-10">
        <h1 className="mb-2 text-xl font-semibold">
          {project.title}
        </h1>

        {project.project_date && (
          <p className="mb-8 text-sm text-neutral-400">
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
