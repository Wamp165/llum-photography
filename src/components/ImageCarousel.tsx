"use client";

import { useState } from "react";
import Image from "next/image";

type ImageCarouselProps = {
  images: string[];
  preload?: boolean;
};

const ARROW_CLASSES =
  "absolute top-1/2 z-10 -translate-y-1/2 px-2 text-6xl font-extralight text-neutral-400 transition-colors duration-200 hover:text-neutral-800";

export default function ImageCarousel({
  images,
  preload = false,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Images already shown stay mounted so going back never reloads them.
  const [visited, setVisited] = useState<ReadonlySet<number>>(
    () => new Set([0])
  );

  if (images.length === 0) {
    return null;
  }

  const hasMany = images.length > 1;
  const count = images.length;

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setVisited((current) =>
      current.has(index) ? current : new Set(current).add(index)
    );
  };

  const previous = () => goTo(currentIndex === 0 ? count - 1 : currentIndex - 1);
  const next = () => goTo(currentIndex === count - 1 ? 0 : currentIndex + 1);

  // Opacity-hidden images still download, so only the current one, its
  // neighbours (ready for the next click) and visited ones are rendered.
  const isMounted = (index: number) =>
    visited.has(index) ||
    index === currentIndex ||
    index === (currentIndex + 1) % count ||
    index === (currentIndex - 1 + count) % count;

  return (
    <div className="relative">
      {hasMany && (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label="Previous image"
            className={`${ARROW_CLASSES} left-0 xl:-left-16`}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className={`${ARROW_CLASSES} right-0 xl:-right-16`}
          >
            ›
          </button>
        </>
      )}

      {/* Mounted images share one grid cell, so the box takes the tallest one's height. */}
      <div className={`grid ${hasMany ? "mx-10 xl:mx-0" : ""}`}>
        {images.map((image, index) => isMounted(index) && (
          <Image
            key={`${index}-${image}`}
            src={image}
            alt=""
            width={2000}
            height={1333}
            sizes="(max-width: 1100px) 100vw, 1020px"
            preload={preload && index === 0}
            aria-hidden={index !== currentIndex}
            className={`col-start-1 row-start-1 h-auto max-h-[80vh] w-full self-center object-contain transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          />
        ))}
      </div>

      {hasMany && (
        <div className="mt-8 flex justify-center gap-3">
          {images.map((image, index) => (
            <button
              key={`${index}-${image}`}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === currentIndex}
              className={`h-2 w-2 rounded-full transition ${
                index === currentIndex
                  ? "bg-neutral-500"
                  : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
