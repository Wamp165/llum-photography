import Link from "next/link";
import Image from "next/image";
import type { ProjectListItem } from "@/types/project-list-item";

type Props = {
  projects: ProjectListItem[];
};

export default function Grid({
  projects,
}: Props) {
  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${project.category_slug}/${project.slug}`}
            className="group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={project.cover_image ?? ""}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <p className="mt-3 text-sm">
              {project.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}