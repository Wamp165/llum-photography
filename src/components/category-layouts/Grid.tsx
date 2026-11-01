import Link from "next/link";
import Image from "next/image";
import { SIZES_GRID, lcpProps } from "@/lib/image-sizes";
import type { CategoryLayoutProps } from "@/types/category-layout";

export default function Grid({
  projects,
}: CategoryLayoutProps) {
  const lcpId = projects.find((project) => project.cover_image)?.id;

  return (
    <div>
      <div className="grid items-start gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${project.category_slug}/${project.slug}`}
            className="block"
          >
            {project.cover_image && (
              <Image
                src={project.cover_image}
                alt={project.title}
                width={1200}
                height={900}
                sizes={SIZES_GRID}
                {...lcpProps(project.id === lcpId)}
                className="h-auto w-full"
              />
            )}

            <p className="mt-3 text-meta">
              {project.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
