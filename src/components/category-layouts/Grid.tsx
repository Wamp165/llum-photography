import { SIZES_WIDE_THIRD } from "@/lib/image-sizes";
import type { CategoryLayoutProps } from "@/types/category-layout";
import ProjectCard from "./ProjectCard";

export default function Grid({
  projects,
}: CategoryLayoutProps) {
  const lcpId = projects.find((project) => project.cover_image)?.id;

  return (
    <div className="site-container-wide grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          sizes={SIZES_WIDE_THIRD}
          heightClassName="h-[60svh] min-h-[22rem] md:h-[32rem]"
          size="small"
          lcp={project.id === lcpId}
        />
      ))}
    </div>
  );
}
