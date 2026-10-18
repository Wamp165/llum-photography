import Link from "next/link";
import Image from "next/image";
import type { CategoryLayoutProps } from "@/types/category-layout";

export default function Editorial({
  projects,
}: CategoryLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/${project.category_slug}/${project.slug}`}
          className="block border-b border-neutral-200 py-16"
        >
          <article className="flex flex-col gap-8 md:flex-row md:gap-12">
            {project.cover_image && (
              <div className="shrink-0">
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  width={700}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="h-auto w-auto max-w-full md:max-w-[700px]"
                />
              </div>
            )}

            <div className="max-w-xs">
              <h2 className="mb-4 text-lg font-medium">
                {project.title}
              </h2>

              {project.description && (
                <p className="text-sm leading-relaxed text-neutral-600">
                  {project.description}
                </p>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
