import LightboxImage from "@/components/LightboxImage";
import { SIZES_HALF_GAP_10, lcpProps } from "@/lib/image-sizes";

type Props = {
  image: string;
  alt: string;
  text: string;
  lcp?: boolean;
};

export default function ImageRightTextLeft({
  image,
  alt,
  text,
  lcp,
}: Props) {
  return (
    <section className="my-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <p className="order-2 whitespace-pre-line px-4 text-center text-body md:order-1">
          {text}
        </p>

        <LightboxImage
          src={image}
          alt={alt}
          width={1200}
          height={1600}
          sizes={SIZES_HALF_GAP_10}
          {...lcpProps(lcp)}
          className="order-1 h-auto w-full md:order-2"
        />
      </div>
    </section>
  );
}
