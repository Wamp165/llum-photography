"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SIZES_WIDE_CAROUSEL, lcpProps } from "@/lib/image-sizes";
import { projectMeta } from "@/lib/project-meta";
import type { CategoryLayoutProps } from "@/types/category-layout";

const ARROW_CLASSES =
  "px-2 text-5xl font-extralight leading-none text-neutral-400 transition-colors duration-200 hover:text-neutral-900";

/** One project at a time: cover on the left, text on the right, arrows to move between works. */
export default function Carousel({ projects }: CategoryLayoutProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = projects.length;

  if (count === 0) {
    return null;
  }

  const previous = () => setCurrentIndex((index) => (index === 0 ? count - 1 : index - 1));
  const next = () => setCurrentIndex((index) => (index === count - 1 ? 0 : index + 1));

  // Opacity-hidden slides still download their photo: mount only the current one and its
  // neighbours (ready for the next click).
  const isMounted = (index: number) =>
    index === currentIndex ||
    index === (currentIndex + 1) % count ||
    index === (currentIndex - 1 + count) % count;

  return (
    <div className="site-container-wide">
      {/* Mounted slides share one grid cell, so the box takes the tallest one's height. */}
      <div className="grid">
        {projects.map((project, index) => {
          if (!isMounted(index)) return null;

          const active = index === currentIndex;
          const href = `/${project.category_slug}/${project.slug}`;
          const meta = projectMeta(project);

          return (
            <article
              key={project.id}
              aria-hidden={!active}
              inert={!active}
              className={`col-start-1 row-start-1 grid gap-6 transition-opacity duration-300 md:grid-cols-[3fr_2fr] md:items-center md:gap-10 ${
                active ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Link
                href={href}
                tabIndex={-1}
                className="relative block h-[55svh] overflow-hidden bg-neutral-900 md:h-[75svh]"
              >
                {project.cover_image && (
                  <Image
                    src={project.cover_image}
                    alt=""
                    fill
                    sizes={SIZES_WIDE_CAROUSEL}
                    {...lcpProps(index === 0)}
                    className="object-cover"
                  />
                )}
              </Link>

              <div>
                {meta && (
                  <p className="mb-3 text-meta uppercase tracking-[0.2em] text-neutral-500">
                    {meta}
                  </p>
                )}

                <h2 className="font-display text-display font-semibold">
                  <Link href={href}>{project.title}</Link>
                </h2>

                {project.description && (
                  <p className="mt-4 max-w-md text-body text-neutral-600">
                    {project.description}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-between md:justify-end md:gap-8">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous project"
            className={ARROW_CLASSES}
          >
            ‹
          </button>

          <p className="text-meta text-neutral-500" aria-live="polite">
            {currentIndex + 1} / {count}
          </p>

          <button
            type="button"
            onClick={next}
            aria-label="Next project"
            className={ARROW_CLASSES}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
