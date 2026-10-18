"use client";

import { useId, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { BlockFieldsProps } from "./index";

export default function TextBlockFields({ initial }: BlockFieldsProps<"only_text_center">) {
  const id = useId();
  const [text, setText] = useState(initial?.text ?? "");

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>Text</Label>
      <Textarea id={id} value={text} onChange={(event) => setText(event.target.value)} rows={8} />
      <input type="hidden" name="content" value={JSON.stringify({ text })} />
    </div>
  );
}
