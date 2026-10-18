import Thumbnail from "@/components/admin/Thumbnail";
import type { ProjectBlockData } from "@/types/project-block";

type Props = {
  block: ProjectBlockData;
};

function excerpt(text: string): string {
  return text.length > 140 ? `${text.slice(0, 140)}…` : text;
}

/** Compact preview of a block in the admin list. */
export default function BlockSummary({ block }: Props) {
  switch (block.type) {
    case "only_text_center":
      return <p className="text-sm text-muted-foreground">{excerpt(block.content.text)}</p>;

    case "image_gallery":
    case "carousel":
      return (
        <div className="flex flex-wrap gap-2">
          {block.content.images.map((image, index) => (
            <Thumbnail key={`${index}-${image}`} url={image} size="sm" />
          ))}
        </div>
      );

    case "image_left_text_right":
    case "image_right_text_left":
    case "image_center_text_above":
    case "image_center_text_below":
      return (
        <div className="flex items-start gap-3">
          <Thumbnail url={block.content.image} size="sm" />
          <p className="text-sm text-muted-foreground">{excerpt(block.content.text)}</p>
        </div>
      );

    default: {
      // A compile error here means a block type is missing its `case`.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
