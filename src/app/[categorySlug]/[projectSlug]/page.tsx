import { notFound } from "next/navigation";

import { getProjectBySlug }
  from "@/data/projects";

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

  const project =
    await getProjectBySlug(
      categorySlug,
      projectSlug
    );

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-8 py-16">
      <h1 className="text-3xl">
        {project.title}
      </h1>
    </main>
  );
}