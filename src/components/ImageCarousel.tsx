"use client";

import { useState } from "react";
import Image from "next/image";

type ImageCarouselProps = {
  images: string[];
  preload?: boolean;
};

const ARROW_CLASSES =
  "absolute top-1/2 z-10 -translate-y-1/2 px-2 text-6xl font-extralight text-neutral-300 transition-colors duration-200 hover:text-neutral-500";

export default function ImageCarousel({
  images,
  preload = false,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

  const hasMany = images.length > 1;

  const previous = () => {
    setCurrentIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const next = () => {
    setCurrentIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  return (
    <div className="relative">
      {hasMany && (
        <>
          <button
            type="button"
            onClick={previous}
            aria-label="Previous image"
            className={`${ARROW_CLASSES} left-0 2xl:-left-16`}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className={`${ARROW_CLASSES} right-0 2xl:-right-16`}
          >
            ›
          </button>
        </>
      )}

      <div
        className={`relative h-[60vh] overflow-hidden md:h-[75vh] ${
          hasMany ? "mx-10 2xl:mx-0" : ""
        }`}
      >
        {images.map((image, index) => (
          <div
            key={`${index}-${image}`}
            aria-hidden={index !== currentIndex}
            className={`absolute inset-0 transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              preload={preload && index === 0}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {hasMany && (
        <div className="mt-8 flex justify-center gap-3">
          {images.map((image, index) => (
            <button
              key={`${index}-${image}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
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
