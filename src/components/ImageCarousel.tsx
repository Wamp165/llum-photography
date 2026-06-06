"use client";

import { useState } from "react";
import Image from "next/image";

type ImageCarouselProps = {
  images: string[];
};

export default function ImageCarousel({
  images,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

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
    <section className="relative mt-10">
      {images.length > 1 && (
        <>
          <button
            onClick={previous}
            className="absolute -left-13 top-1/2 z-10 -translate-y-1/2 text-6xl font-extralight text-neutral-300 transition-colors duration-200 hover:text-neutral-500"
          >
            ‹
          </button>

          <button
            onClick={next}
            className="absolute -right-13 top-1/2 z-10 -translate-y-1/2 text-6xl font-extralight text-neutral-300 transition-colors duration-200 hover:text-neutral-500"
          >
            ›
          </button>
        </>
      )}

      <div className="flex justify-center">
        <Image
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt=""
          width={1800}
          height={1200}
          priority
          className="h-auto max-h-[75vh] w-auto"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition ${
                index === currentIndex
                  ? "bg-neutral-500"
                  : "bg-neutral-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}