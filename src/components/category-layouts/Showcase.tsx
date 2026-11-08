import { SIZES_WIDE_FULL } from "@/lib/image-sizes";
import type { CategoryLayoutProps } from "@/types/category-layout";
import ProjectCard from "./ProjectCard";

export default function Showcase({
  projects,
}: CategoryLayoutProps) {
  const lcpId = projects.find((project) => project.cover_image)?.id;

  return (
    <div className="site-container-wide flex flex-col gap-5 md:gap-[50px]">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          sizes={SIZES_WIDE_FULL}
          heightClassName="h-[75svh] min-h-[26rem] md:h-[45rem]"
          lcp={project.id === lcpId}
        />
      ))}
    </div>
  );
}
