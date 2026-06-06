import type { ProjectBlock } from "@/types/project-block";
import type { ImageBlockContent, TextBlockContent, ImageTextBlockContent} from "@/types/project-block-content";
import ImageGallery from "./ImageGallery";
import OnlyTextCenter from "./OnlyTextCenter";
import ImageCarousel from "@/components/ImageCarousel";
import ImageCenterTextAbove from "./ImageCenterTextAbove";
import ImageCenterTextBelow from "./ImageCenterTextBelow";
import ImageLeftTextRight from "./ImageLeftTextRight";
import ImageRightTextLeft from "./ImageRightTextLeft";

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

    case "carousel": {
        const content =
            block.content as ImageBlockContent;

        return (
            <ImageCarousel
            images={content.images}
            />
        );
    }

    case "image_center_text_above": {
      const content =
        block.content as ImageTextBlockContent;

      return (
        <ImageCenterTextAbove
          image={content.image}
          text={content.text}
        />
      );
    }

    case "image_center_text_below": {
      const content =
        block.content as ImageTextBlockContent;

      return (
        <ImageCenterTextBelow
          image={content.image}
          text={content.text}
        />
      );
    }

    case "image_left_text_right": {
      const content =
        block.content as ImageTextBlockContent;

      return (
        <ImageLeftTextRight
          image={content.image}
          text={content.text}
        />
      );
    }

    case "image_right_text_left": {
      const content =
        block.content as ImageTextBlockContent;

      return (
        <ImageRightTextLeft
          image={content.image}
          text={content.text}
        />
      );
    }

    default:
      return null;
  }
}