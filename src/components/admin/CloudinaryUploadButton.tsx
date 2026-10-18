"use client";

import { useRef } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { CLOUDINARY_UPLOAD_FOLDER } from "@/lib/constants";
import { useUploadEnabled } from "./UploadContext";

type Props = {
  /** Called once when the upload queue ends, with every uploaded URL in order. */
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
};

/**
 * Signed upload with Cloudinary's widget. The signature comes from
 * /api/sign-cloudinary-params (admin only); the API secret never reaches the browser.
 */
export default function CloudinaryUploadButton({ onUploaded, multiple = false }: Props) {
  const enabled = useUploadEnabled();
  const uploaded = useRef<string[]>([]);

  if (!enabled) {
    return (
      <p className="text-xs text-muted-foreground">
        Uploads are disabled (Cloudinary is not configured). Paste an image URL instead.
      </p>
    );
  }

  return (
    <CldUploadWidget
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{
        folder: CLOUDINARY_UPLOAD_FOLDER,
        sources: ["local", "url"],
        multiple,
        maxFiles: multiple ? 30 : 1,
        resourceType: "image",
        clientAllowedFormats: ["image"],
        maxFileSize: 10_000_000, // Cloudinary free plan limit for images.
        cropping: false, // Photos are never cropped.
        showPoweredBy: false,
      }}
      onSuccess={(result) => {
        const info = result.info;
        if (typeof info === "object" && info !== null && typeof info.secure_url === "string") {
          uploaded.current.push(info.secure_url);
        }
      }}
      onQueuesEnd={(_result, { widget }) => {
        if (uploaded.current.length > 0) onUploaded(uploaded.current);
        uploaded.current = [];
        widget.close();
      }}
    >
      {({ open, isLoading }) => (
        <Button type="button" variant="outline" size="sm" disabled={isLoading} onClick={() => open()}>
          {multiple ? "Upload images" : "Upload image"}
        </Button>
      )}
    </CldUploadWidget>
  );
}
