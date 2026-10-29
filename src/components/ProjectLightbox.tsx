"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import Lightbox from "./Lightbox";

type ProjectLightboxValue = {
  /** Opens the viewer on `src`; false when that photo isn't part of the set. */
  open: (src: string) => boolean;
};

const ProjectLightboxContext = createContext<ProjectLightboxValue | null>(null);

export function useProjectLightbox() {
  return useContext(ProjectLightboxContext);
}

/** Lets every photo inside open the same full-screen viewer and browse the others. */
export default function ProjectLightbox({
  images,
  label,
  children,
}: {
  images: string[];
  label: string;
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);

  const open = (src: string) => {
    const found = images.indexOf(src);
    if (found === -1) return false;
    setIndex(found);
    return true;
  };

  return (
    <ProjectLightboxContext value={{ open }}>
      {children}
      {index !== null && (
        <Lightbox
          images={images}
          index={index}
          label={label}
          onIndexChange={setIndex}
          onClose={() => setIndex(null)}
        />
      )}
    </ProjectLightboxContext>
  );
}
