import Image from "next/image";
import { SIZES_FULL } from "@/lib/image-sizes";

type Props = {
  image: string;
  alt: string;
  text: string;
};

export default function ImageCenterTextBelow({
  image,
  alt,
  text,
}: Props) {
  return (
    <section className="my-24">
      <Image
        src={image}
        alt={alt}
        width={2000}
        height={1333}
        sizes={SIZES_FULL}
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