"use client";

import { useState, type KeyboardEvent } from "react";
import Image, { type ImageProps } from "next/image";
import Lightbox from "./Lightbox";
import { useProjectLightbox } from "./ProjectLightbox";
import { preloadLightboxImage, rememberShownUrl } from "@/lib/lightbox-images";

type LightboxImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

/**
 * A public photo that opens full screen when clicked (or Enter / Space).
 * Inside a ProjectLightbox it browses the project's photos; alone, just itself.
 */
export default function LightboxImage({ className, ...props }: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  const project = useProjectLightbox();
  // Hidden carousel slides must not be clickable or focusable.
  const hidden = props["aria-hidden"] === true || props["aria-hidden"] === "true";

  const openViewer = () => {
    if (!project?.open(props.src)) setOpen(true);
  };

  const onImageKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openViewer();
    }
  };

  return (
    <>
      <Image
        {...props}
        alt={props.alt}
        className={hidden ? className : `${className ?? ""} hover:cursor-pointer`}
        role={hidden ? undefined : "button"}
        tabIndex={hidden ? undefined : 0}
        onLoad={(event) => {
          rememberShownUrl(props.src, event.currentTarget.currentSrc);
          props.onLoad?.(event);
        }}
        onPointerEnter={hidden ? undefined : () => preloadLightboxImage(props.src)}
        onFocus={hidden ? undefined : () => preloadLightboxImage(props.src)}
        onClick={hidden ? undefined : openViewer}
        onKeyDown={hidden ? undefined : onImageKeyDown}
      />

      {open && (
        <Lightbox
          images={[props.src]}
          index={0}
          label={props.alt}
          onIndexChange={() => {}}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
