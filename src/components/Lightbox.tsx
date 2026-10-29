"use client";

import { useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import Image from "next/image";
import { SIZES_LIGHTBOX } from "@/lib/image-sizes";

type LightboxProps = {
  images: string[];
  index: number;
  label: string;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_DISTANCE = 50;

const ARROW_CLASSES =
  "absolute top-1/2 z-10 -translate-y-1/2 px-3 py-4 text-6xl font-extralight leading-none text-white/80 transition-colors hover:text-white";

/** Full-screen viewer: arrows and keys on desktop, swipe on touch screens. */
export default function Lightbox({ images, index, label, onIndexChange, onClose }: LightboxProps) {
  const count = images.length;
  const hasMany = count > 1;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const previous = () => onIndexChange((index - 1 + count) % count);
  const next = () => onIndexChange((index + 1) % count);

  // Latest handlers for the keydown listener, which is registered only once.
  const handlers = useRef({ previous, next, onClose, hasMany });
  useEffect(() => {
    handlers.current = { previous, next, onClose, hasMany };
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const current = handlers.current;
      if (event.key === "Escape") current.onClose();
      else if (current.hasMany && event.key === "ArrowLeft") current.previous();
      else if (current.hasMany && event.key === "ArrowRight") current.next();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || !hasMany) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else previous();
  };

  const stop = (action: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    action();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    >
      <button
        type="button"
        autoFocus
        onClick={stop(onClose)}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 px-3 py-1 text-4xl font-extralight leading-none text-white/80 transition-colors hover:text-white"
      >
        ×
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={stop(previous)}
            aria-label="Previous image"
            className={`${ARROW_CLASSES} left-0 sm:left-2`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={stop(next)}
            aria-label="Next image"
            className={`${ARROW_CLASSES} right-0 sm:right-2`}
          >
            ›
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/70">
            {index + 1} / {count}
          </p>
        </>
      )}

      <Image
        key={images[index]}
        src={images[index]}
        alt={`${label} — photograph ${index + 1}${hasMany ? ` of ${count}` : ""}`}
        width={2000}
        height={1333}
        sizes={SIZES_LIGHTBOX}
        className="h-auto max-h-[92vh] w-auto max-w-full select-none object-contain"
      />
    </div>
  );
}
