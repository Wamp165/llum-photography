import type { ProjectBlock } from "@/types/project-block";
import type { ImageBlockContent, TextBlockContent } from "@/types/project-block-content";
import ImageGallery from "./ImageGallery";
import OnlyTextCenter from "./OnlyTextCenter";

type Props = {
  block: ProjectBlock;
};

export default function BlockRenderer({
  block,
}: Props) {
  switch (block.type) {
    case "image_gallery": {
      const content =
        block.content as ImageBlockContent;

      return (
        <ImageGallery
          images={content.images}
        />
      );
    }
    case "only_text_center": {
    const content =
        block.content as TextBlockContent;

    return (
        <OnlyTextCenter
        text={content.text}
        />
    );
    }

    default:
      return null;
  }
}