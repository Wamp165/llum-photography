import Link from "next/link";
import Image from "next/image";
import { SIZES_HALF_GAP_10, lcpProps } from "@/lib/image-sizes";
import type { CategoryLayoutProps } from "@/types/category-layout";

export default function Editorial({
  projects,
}: CategoryLayoutProps) {
  const lcpId = projects.find((project) => project.cover_image)?.id;

  return (
    <div>
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/${project.category_slug}/${project.slug}`}
          className="block border-b border-neutral-200 py-14 first:pt-0 last:border-b-0"
        >
          <article className="grid items-start gap-8 md:grid-cols-2 md:gap-10">
            {project.cover_image && (
              <div>
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  width={700}
                  height={500}
                  sizes={SIZES_HALF_GAP_10}
                  {...lcpProps(project.id === lcpId)}
                  className="h-auto w-full"
                />
              </div>
            )}

            <div className="max-w-xs">
              <h2 className="mb-4 font-display text-title font-semibold">
                {project.title}
              </h2>

              {project.description && (
                <p className="text-body text-neutral-600">
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
