import type { ProjectBlock } from "@/types/project-block";
import type { ImageBlockContent } from "@/types/project-block-content";
import OnlyImageCenter from "./OnlyImageCenter";

type Props = {
  block: ProjectBlock;
};

export default function BlockRenderer({
  block,
}: Props) {
  switch (block.type) {
    case "only_image_center": {
      const content =
        block.content as ImageBlockContent;

      return (
        <OnlyImageCenter
          images={content.images}
        />
      );
    }

    default:
      return null;
  }
}