import LightboxImage from "@/components/LightboxImage";
import { SIZES_FULL, lcpProps } from "@/lib/image-sizes";

type Props = {
  image: string;
  alt: string;
  text: string;
  lcp?: boolean;
};

export default function ImageCenterTextBelow({
  image,
  alt,
  text,
  lcp,
}: Props) {
  return (
    <section className="my-24">
      <LightboxImage
        src={image}
        alt={alt}
        width={2000}
        height={1333}
        sizes={SIZES_FULL}
        {...lcpProps(lcp)}
        className="h-auto max-h-[85vh] w-full object-contain"
      />

      <div className="mx-auto mt-6 max-w-2xl">
        <p className="whitespace-pre-line text-center text-sm leading-7">
          {text}
        </p>
      </div>
    </section>
  );
}