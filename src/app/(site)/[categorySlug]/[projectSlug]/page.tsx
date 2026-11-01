import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import { getCurrentAdmin } from "@/lib/auth-guard";
import { getSettings } from "@/data/settings";
import { isSlug } from "@/lib/schemas/common";
import { socialMetadata } from "@/lib/social-metadata";
import { getProjectBlocks } from "@/data/project-blocks";
import { formatProjectDate } from "@/lib/format-date";
import { SIZES_FULL, lcpProps } from "@/lib/image-sizes";
import ProjectLightbox from "@/components/ProjectLightbox";
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
  if (!isSlug(categorySlug) || !isSlug(projectSlug)) return {};

  const admin = await getCurrentAdmin();
  const project = await getProjectBySlug(categorySlug, projectSlug, admin !== null);

  if (!project) {
    return {};
  }

  const settings = await getSettings();

  return {
    title: project.title,
    description: project.description ?? undefined,
    ...socialMetadata({
      siteName: settings.photographer_name,
      title: project.title,
      description: project.description,
      image: project.cover_image,
    }),
    robots: project.is_published ? undefined : { index: false, follow: false },
  };
}

export default async function ProjectPage({
  params,
}: Props) {
  const { categorySlug, projectSlug } = await params;
  if (!isSlug(categorySlug) || !isSlug(projectSlug)) notFound();

  // Drafts are visible only to the logged-in admin (for previewing).
  const admin = await getCurrentAdmin();
  const project = await getProjectBySlug(categorySlug, projectSlug, admin !== null);

  if (!project) {
    notFound();
  }

  const blocks = await getProjectBlocks(project.id);
  // Without a cover, the first block with a photo holds the LCP image.
  const lcpBlockId = project.cover_image
    ? undefined
    : blocks.find((block) => block.type !== "only_text_center")?.id;

  // Photos of the blocks in page order. The cover is not part of the viewer.
  const lightboxImages = [
    ...new Set(
      blocks.flatMap((block) => {
        switch (block.type) {
          case "only_text_center":
            return [];
          case "image_gallery":
          case "carousel":
            return block.content.images;
          default:
            return [block.content.image];
        }
      })
    ),
  ];

  return (
    <article className="site-container pb-24">
      {!project.is_published && (
        <p className="mt-4 border-y border-neutral-200 py-2 text-center text-meta uppercase tracking-wide text-muted">
          Draft — not public
        </p>
      )}

      {project.cover_image && (
        <Image
          src={project.cover_image}
          alt={project.title}
          width={2000}
          height={1333}
          sizes={SIZES_FULL}
          {...lcpProps(true)}
          className="h-auto max-h-[85vh] w-full object-contain"
        />
      )}

      <header className="mt-10">
        <h1 className="mb-2 text-display font-medium">
          {project.title}
        </h1>

        {project.project_date && (
          <p className="mb-8 text-meta text-muted">
            <time dateTime={project.project_date}>
              {formatProjectDate(project.project_date)}
            </time>
          </p>
        )}

        {project.introduction && (
          <p className="max-w-prose whitespace-pre-line text-body">
            {project.introduction}
          </p>
        )}
      </header>

      <ProjectLightbox images={lightboxImages} label={project.title}>
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            projectTitle={project.title}
            lcp={block.id === lcpBlockId}
          />
        ))}
      </ProjectLightbox>
    </article>
  );
}
