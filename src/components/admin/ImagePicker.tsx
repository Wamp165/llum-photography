"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CloudinaryUploadButton from "./CloudinaryUploadButton";
import Thumbnail from "./Thumbnail";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

/** Controlled single image: thumbnail, paste a URL, upload, remove. */
export default function ImagePicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <Thumbnail url={value || null} />

      <div className="grid min-w-0 flex-1 gap-2">
        <Input
          type="url"
          value={value}
          onChange={(event) => onChange(event.target.value.trim())}
          placeholder="https://res.cloudinary.com/…"
          aria-label="Image URL"
        />
        <div className="flex flex-wrap items-center gap-2">
          <CloudinaryUploadButton onUploaded={(urls) => onChange(urls[0])} />
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
