"use client";

import Link from "next/link";
import Image from "next/image";
import { lcpProps } from "@/lib/image-sizes";
import { projectMeta } from "@/lib/project-meta";
import type { ProjectListItem } from "@/types/project-list-item";

type Props = {
  project: ProjectListItem;
  sizes: string;
  /** Height of the card (the photo fills it and is cropped to fit). */
  heightClassName: string;
  /** "large" for hero-like cards (bigger title), "small" for the rest. */
  size?: "large" | "small";
  lcp?: boolean;
};

// The location, years and description show on hover (mouse) or while the card is pressed (touch).
// The grid-rows trick animates the height from 0 without measuring anything.
const REVEAL_CLASSES =
  "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-active:grid-rows-[1fr] group-active:opacity-100";

/** Cover photo with the project's title centered over a dark veil that deepens on hover. */
export default function ProjectCard({
  project,
  sizes,
  heightClassName,
  size = "large",
  lcp,
}: Props) {
  const large = size === "large";
  const meta = projectMeta(project);

  return (
    <Link
      href={`/${project.category_slug}/${project.slug}`}
      // A long press must show the text, not the browser's link menu.
      onContextMenu={(event) => {
        if (window.matchMedia("(pointer: coarse)").matches) event.preventDefault();
      }}
      className={`group relative block w-full select-none overflow-hidden bg-neutral-900 [-webkit-touch-callout:none] ${heightClassName}`}
    >
      {project.cover_image && (
        <Image
          src={project.cover_image}
          alt=""
          fill
          sizes={sizes}
          draggable={false}
          {...lcpProps(lcp)}
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/65 group-active:bg-black/65" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
        {meta && (
          <div className={REVEAL_CLASSES}>
            <p className="overflow-hidden pb-3 text-meta uppercase tracking-[0.2em] text-white/80">
              {meta}
            </p>
          </div>
        )}

        <h2
          className={`font-display font-semibold ${
            large ? "text-display md:text-[2.5rem] md:leading-[1.1]" : "text-title"
          }`}
        >
          {project.title}
        </h2>

        {project.description && (
          <div className={REVEAL_CLASSES}>
            <p className="max-w-xl overflow-hidden pt-4 text-body text-white/85">
              {project.description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
