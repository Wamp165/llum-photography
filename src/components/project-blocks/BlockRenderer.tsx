import type { ProjectBlock } from "@/types/project-block";
import ImageGallery from "./ImageGallery";
import OnlyTextCenter from "./OnlyTextCenter";
import ImageCarousel from "@/components/ImageCarousel";
import ImageCenterTextAbove from "./ImageCenterTextAbove";
import ImageCenterTextBelow from "./ImageCenterTextBelow";
import ImageLeftTextRight from "./ImageLeftTextRight";
import ImageRightTextLeft from "./ImageRightTextLeft";

type Props = {
  block: ProjectBlock;
  projectTitle: string;
};

export default function BlockRenderer({
  block,
  projectTitle,
}: Props) {
  switch (block.type) {
    case "only_text_center":
      return <OnlyTextCenter text={block.content.text} />;

    case "image_gallery":
      return <ImageGallery images={block.content.images} projectTitle={projectTitle} />;

    case "carousel":
      return (
        <section className="my-24">
          <ImageCarousel images={block.content.images} altLabel={projectTitle} />
        </section>
      );

    case "image_left_text_right":
      return (
        <ImageLeftTextRight
          image={block.content.image}
          alt={projectTitle}
          text={block.content.text}
        />
      );

    case "image_right_text_left":
      return (
        <ImageRightTextLeft
          image={block.content.image}
          alt={projectTitle}
          text={block.content.text}
        />
      );

    case "image_center_text_above":
      return (
        <ImageCenterTextAbove
          image={block.content.image}
          alt={projectTitle}
          text={block.content.text}
        />
      );

    case "image_center_text_below":
      return (
        <ImageCenterTextBelow
          image={block.content.image}
          alt={projectTitle}
          text={block.content.text}
        />
      );

    default: {
      // A compile error here means a block type is missing its `case`.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}
