"use client";

import { useState } from "react";
import ImageListPicker from "./ImageListPicker";

type Props = {
  /** Form field name; the list is submitted as a JSON array of URLs. */
  name: string;
  defaultValue: string[] | null;
  max?: number;
};

/** A list of images as a form field (inside <ActionForm>). */
export default function ImageListInput({ name, defaultValue, max }: Props) {
  const [images, setImages] = useState(defaultValue ?? []);

  return (
    <>
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      <ImageListPicker value={images} onChange={setImages} max={max} />
    </>
  );
}
