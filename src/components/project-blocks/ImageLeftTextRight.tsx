import LightboxImage from "@/components/LightboxImage";
import { SIZES_HALF_GAP_10, lcpProps } from "@/lib/image-sizes";

type Props = {
  image: string;
  alt: string;
  text: string;
  lcp?: boolean;
};

export default function ImageLeftTextRight({
  image,
  alt,
  text,
  lcp,
}: Props) {
  return (
    <section className="my-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <LightboxImage
          src={image}
          alt={alt}
          width={1200}
          height={1600}
          sizes={SIZES_HALF_GAP_10}
          {...lcpProps(lcp)}
          className="h-auto w-full"
        />

        <p className="whitespace-pre-line px-4 text-center text-sm leading-7">
          {text}
        </p>
      </div>
    </section>
  );
}
