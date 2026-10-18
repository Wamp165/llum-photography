import Link from "next/link";
import Image from "next/image";
import type { CategoryLayoutProps } from "@/types/category-layout";

export default function Grid({
  projects,
}: CategoryLayoutProps) {
  return (
    <div className="mx-auto max-w-[1200px]">
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
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                className="h-auto w-full"
              />
            )}

            <p className="mt-3 text-sm">
              {project.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
