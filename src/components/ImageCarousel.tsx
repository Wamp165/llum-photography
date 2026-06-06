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
    <section>
      <div>
        {images.length > 1 && (
          <div>
            <button
              onClick={previous}
              style={{
                fontSize: "40px",
                padding: "20px",
                cursor: "pointer",
              }}
            >
              ←
            </button>

            <button
              onClick={next}
              style={{
                fontSize: "40px",
                padding: "20px",
                cursor: "pointer",
              }}
            >
              →
            </button>
          </div>
        )}
        <Image
          src={images[currentIndex]}
          alt=""
          width={1600}
          height={1000}
          priority
        />
      </div>
    </section>
  );
}