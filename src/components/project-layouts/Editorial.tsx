import Link from "next/link";
import Image from "next/image";

import type { Project } from "@/types/project";

type Props = {
  projects: Project[];
};

export default function Editorial({
  projects,
}: Props) {
  return (
    <div>
      {projects.map((project) => (
        <Link
          key={project.id}
          href="#"
          className="block border-b border-neutral-200 py-16"
        >
          <article className="flex gap-12">
            <div className="shrink-0">
              {project.cover_image && (
                <Image
                  src={project.cover_image}
                  alt={project.title}
                  width={700}
                  height={500}
                  className="h-auto w-auto max-w-[700px]"
                />
              )}
            </div>

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