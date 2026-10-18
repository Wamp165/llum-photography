"use client";

import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "../ImagePicker";
import type { ImageTextContent } from "@/types/project-block";

type Props = {
  initial: ImageTextContent | null;
};

/** Shared by the four "image + text" block types (same content shape). */
export default function ImageTextBlockFields({ initial }: Props) {
  const id = useId();
  const [image, setImage] = useState(initial?.image ?? "");
  const [text, setText] = useState(initial?.text ?? "");

  return (
    <div className="grid gap-4">
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Image</legend>
        <ImagePicker value={image} onChange={setImage} />
      </fieldset>

      <div className="grid gap-2">
        <Label htmlFor={id}>Text</Label>
        <Textarea id={id} value={text} onChange={(event) => setText(event.target.value)} rows={6} />
      </div>

      <input type="hidden" name="content" value={JSON.stringify({ image, text })} />
    </div>
  );
}
