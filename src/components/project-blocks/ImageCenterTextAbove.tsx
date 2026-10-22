import Image from "next/image";

type Props = {
  image: string;
  alt: string;
  text: string;
};

export default function ImageCenterTextAbove({
  image,
  alt,
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="mx-auto mb-8 max-w-2xl">
        <p className="whitespace-pre-line text-center text-sm leading-7">
          {text}
        </p>
      </div>

      <Image
        src={image}
        alt={alt}
        width={2000}
        height={1333}
        sizes="(max-width: 1100px) 100vw, 1020px"
        className="h-auto max-h-[85vh] w-full object-contain"
      />
    </section>
  );
}