"use client";

import { useState } from "react";
import ImagePicker from "./ImagePicker";

type Props = {
  /** Form field name; the URL ("" when empty) is submitted under it. */
  name: string;
  defaultValue: string | null;
};

/** A single image as a form field (inside <ActionForm>). */
export default function ImageInput({ name, defaultValue }: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");

  return (
    <>
      <input type="hidden" name={name} value={url} />
      <ImagePicker value={url} onChange={setUrl} />
    </>
  );
}
