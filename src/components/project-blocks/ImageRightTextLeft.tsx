import Image from "next/image";

type Props = {
  image: string;
  alt: string;
  text: string;
};

export default function ImageRightTextLeft({
  image,
  alt,
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <p className="order-2 whitespace-pre-line px-4 text-center text-sm leading-7 md:order-1">
          {text}
        </p>

        <Image
          src={image}
          alt={alt}
          width={1200}
          height={1600}
          sizes="(max-width: 768px) 100vw, 500px"
          className="order-1 h-auto w-full md:order-2"
        />
      </div>
    </section>
  );
}
