import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug } from "@/data/projects";
import { getProjectBlocks } from "@/data/project-blocks";
import BlockRenderer from "@/components/project-blocks/BlockRenderer";

type Props = {
  params: Promise<{
    categorySlug: string;
    projectSlug: string;
  }>;
};

export default async function ProjectPage({
  params,
}: Props) {
  const {
    categorySlug,
    projectSlug,
  } = await params;

  const project = await getProjectBySlug(
    categorySlug,
    projectSlug
  );

  if (!project) {
    notFound();
  }

  const blocks = await getProjectBlocks(project.id);

  return (
    <main className="mx-auto max-w-[1400px] px-8">
      {project.cover_image && (
        <div className="mt-12 flex justify-center">
          <Image
            src={project.cover_image}
            alt={project.title}
            width={1800}
            height={1200}
            priority
            className="h-auto max-h-[75vh] w-auto"
          />
        </div>
      )}

      <section className="mx-auto mt-8 max-w-3xl">
        <h1 className="mb-2 text-xl font-medium">
          {project.title}
        </h1>

        {project.project_date && (
          <p className="mb-8 text-sm text-neutral-500">
            {new Date(
              project.project_date
            ).toLocaleDateString()}
          </p>
        )}

        {project.introduction && (
          <p className="whitespace-pre-line leading-8">
            {project.introduction}
          </p>
        )}
        {blocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
          />
        ))}
      </section>
    </main>
  );
}