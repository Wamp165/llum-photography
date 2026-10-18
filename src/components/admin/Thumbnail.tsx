import Image from "next/image";
import { isCloudinaryImageUrl } from "@/lib/schemas/common";
import { cn } from "@/lib/utils";

type Props = {
  url: string | null;
  alt?: string;
  size?: "sm" | "md";
};

// Fixed-size box, but the photo inside is `object-contain`: never cropped.
const SIZES = {
  sm: { box: "h-14 w-20", sizes: "80px" },
  md: { box: "h-28 w-40", sizes: "160px" },
};

export default function Thumbnail({ url, alt = "", size = "md" }: Props) {
  const { box, sizes } = SIZES[size];
  const base = cn(box, "relative flex shrink-0 items-center justify-center rounded-md border text-xs");

  if (!url) {
    return <div className={cn(base, "border-dashed text-muted-foreground")}>No image</div>;
  }

  // next/image throws for hosts not allowed in next.config.ts.
  if (!isCloudinaryImageUrl(url)) {
    return (
      <div className={cn(base, "border-destructive p-1 text-center text-destructive")}>
        Not a Cloudinary URL
      </div>
    );
  }

  return (
    <div className={cn(base, "bg-muted")}>
      <Image src={url} alt={alt} fill sizes={sizes} className="object-contain" />
    </div>
  );
}
