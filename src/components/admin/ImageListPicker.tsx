"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isCloudinaryImageUrl } from "@/lib/schemas/common";
import CloudinaryUploadButton from "./CloudinaryUploadButton";
import Thumbnail from "./Thumbnail";

type Props = {
  value: string[];
  onChange: (images: string[]) => void;
  /** Maximum number of images (no limit when omitted). */
  max?: number;
};

/** Controlled list of images: add (upload or URL), remove, reorder with ↑ ↓. */
export default function ImageListPicker({ value, onChange, max }: Props) {
  const [newUrl, setNewUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const full = max !== undefined && value.length >= max;

  function move(index: number, offset: -1 | 1) {
    const next = [...value];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  }

  function addUrl() {
    if (!isCloudinaryImageUrl(newUrl)) {
      setUrlError("Paste a https://res.cloudinary.com/ image URL.");
      return;
    }
    onChange([...value, newUrl]);
    setNewUrl("");
    setUrlError(null);
  }

  return (
    <div className="grid gap-3">
      {value.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images yet.</p>
      ) : (
        <ol className="grid gap-2">
          {value.map((url, index) => (
            <li key={`${index}-${url}`} className="flex items-center gap-3 rounded-md border p-2">
              <Thumbnail url={url} size="sm" />
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {url.split("/").pop()}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move image up"
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
                aria-label="Move image down"
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove image"
              >
                <X />
              </Button>
            </li>
          ))}
        </ol>
      )}

      {full ? (
        <p className="text-xs text-muted-foreground">Maximum of {max} images reached.</p>
      ) : (
        <div className="grid gap-2 rounded-md border border-dashed p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="url"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value.trim())}
              onKeyDown={(event) => {
                // Enter adds the URL instead of submitting the whole form.
                if (event.key === "Enter") {
                  event.preventDefault();
                  addUrl();
                }
              }}
              placeholder="Paste an image URL…"
              aria-label="New image URL"
            />
            <Button type="button" variant="outline" onClick={addUrl} disabled={newUrl === ""}>
              Add
            </Button>
          </div>
          {urlError && <p className="text-xs text-destructive">{urlError}</p>}
          <CloudinaryUploadButton
            multiple
            onUploaded={(urls) => onChange([...value, ...urls].slice(0, max))}
          />
        </div>
      )}
    </div>
  );
}
