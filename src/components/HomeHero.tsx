"use client";

import { useState } from "react";
import Image from "next/image";
import { SIZES_HERO, lcpProps } from "@/lib/image-sizes";

type Props = {
  images: string[];
  altLabel: string;
};

const ARROW_CLASSES =
  "absolute top-1/2 z-10 -translate-y-1/2 px-3 text-6xl font-extralight text-white/70 transition-colors duration-200 hover:text-white";

/**
 * Full-screen home image. It is the one place where a photo is cropped (`object-cover`),
 * on purpose: the photo fills the whole viewport. The navbar and footer sit on top of it
 * (see the `[data-home-hero]` rules in globals.css).
 */
export default function HomeHero({ images, altLabel }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Images already shown stay mounted so going back never reloads them.
  const [visited, setVisited] = useState<ReadonlySet<number>>(
    () => new Set([0])
  );

  if (images.length === 0) {
    return null;
  }

  const count = images.length;
  const hasMany = count > 1;

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setVisited((current) =>
      current.has(index) ? current : new Set(current).add(index)
    );
  };

  const isMounted = (index: number) =>
    visited.has(index) ||
    index === currentIndex ||
    index === (currentIndex + 1) % count ||
    index === (currentIndex - 1 + count) % count;

  return (
    <section data-home-hero className="relative h-svh w-full overflow-hidden bg-neutral-900">
      {images.map((image, index) => isMounted(index) && (
        <Image
          key={`${index}-${image}`}
          src={image}
          alt={`${altLabel} — photograph ${index + 1} of ${count}`}
          fill
          sizes={SIZES_HERO}
          {...lcpProps(index === 0)}
          aria-hidden={index !== currentIndex}
          className={`object-cover object-[center_44%] max-md:object-[49.3%_center] transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Keeps the white navbar and footer readable on bright photos. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),transparent_35%,transparent_70%,rgba(0,0,0,0.24))]" />

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => goTo(currentIndex === 0 ? count - 1 : currentIndex - 1)}
            aria-label="Previous image"
            className={`${ARROW_CLASSES} left-0`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(currentIndex === count - 1 ? 0 : currentIndex + 1)}
            aria-label="Next image"
            className={`${ARROW_CLASSES} right-0`}
          >
            ›
          </button>

          <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center gap-3">
            {images.map((image, index) => (
              <button
                key={`${index}-${image}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show image ${index + 1} of ${count}`}
                aria-current={index === currentIndex}
                className={`h-2 w-2 rounded-full transition ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
