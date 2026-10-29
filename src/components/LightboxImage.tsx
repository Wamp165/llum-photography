"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Image, { type ImageProps } from "next/image";
import { SIZES_LIGHTBOX } from "@/lib/image-sizes";

type LightboxImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

/** A public photo that opens full screen when clicked (or Enter / Space). */
export default function LightboxImage({ className, ...props }: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  // Hidden carousel slides must not be clickable or focusable.
  const hidden = props["aria-hidden"] === true || props["aria-hidden"] === "true";

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const onImageKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      <Image
        {...props}
        alt={props.alt}
        className={hidden ? className : `${className ?? ""} cursor-zoom-in`}
        role={hidden ? undefined : "button"}
        tabIndex={hidden ? undefined : 0}
        onClick={hidden ? undefined : () => setOpen(true)}
        onKeyDown={hidden ? undefined : onImageKeyDown}
      />

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={props.alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        >
          <button
            type="button"
            autoFocus
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 px-3 py-1 text-4xl font-extralight leading-none text-white/80 transition-colors hover:text-white"
          >
            ×
          </button>
          <Image
            src={props.src}
            alt={props.alt}
            width={2000}
            height={1333}
            sizes={SIZES_LIGHTBOX}
            className="h-auto max-h-[92vh] w-auto max-w-full object-contain"
          />
        </div>
      )}
    </>
  );
}
