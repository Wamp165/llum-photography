import Link from "next/link";
import Image from "next/image";
import type { CategoryLayoutProps } from "@/types/category-layout";
import type { ProjectListItem } from "@/types/project-list-item";

export default function Featured({
  projects,
}: CategoryLayoutProps) {
  const [featured, ...rest] = projects;

  if (!featured) {
    return null;
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <Link
        href={projectHref(featured)}
        className="block"
      >
        {featured.cover_image && (
          <div className="flex justify-center">
            <Image
              src={featured.cover_image}
              alt={featured.title}
              width={1800}
              height={1200}
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="h-auto max-h-[80vh] w-auto"
            />
          </div>
        )}

        <div className="mx-auto mt-6 max-w-xl text-center">
          <h2 className="text-lg font-medium">
            {featured.title}
          </h2>

          {featured.description && (
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {featured.description}
            </p>
          )}
        </div>
      </Link>

      {rest.length > 0 && (
        <div className="mt-24 grid items-start gap-12 md:grid-cols-2">
          {rest.map((project) => (
            <Link
              key={project.id}
              href={projectHref(project)}
              className="block"
            >
              {project.cover_image && (
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  width={1200}
                  height={900}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="h-auto w-full"
                />
              )}

              <p className="mt-3 text-sm">
                {project.title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function projectHref(project: ProjectListItem): string {
  return `/${project.category_slug}/${project.slug}`;
}
