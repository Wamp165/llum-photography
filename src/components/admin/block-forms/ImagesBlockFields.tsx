"use client";

import { useState } from "react";
import ImageListPicker from "../ImageListPicker";

type Props = {
  initial: { images: string[] } | null;
  max?: number;
};

/** Shared by the gallery and carousel block types. */
export default function ImagesBlockFields({ initial, max }: Props) {
  const [images, setImages] = useState(initial?.images ?? []);

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">
        Images{max !== undefined ? ` (1 to ${max})` : ""}
      </legend>
      <ImageListPicker value={images} onChange={setImages} max={max} />
      <input type="hidden" name="content" value={JSON.stringify({ images })} />
    </fieldset>
  );
}
