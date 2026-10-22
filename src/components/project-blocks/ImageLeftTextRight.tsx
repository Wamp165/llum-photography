import Image from "next/image";

type Props = {
  image: string;
  alt: string;
  text: string;
};

export default function ImageLeftTextRight({
  image,
  alt,
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <Image
          src={image}
          alt={alt}
          width={1200}
          height={1600}
          sizes="(max-width: 768px) 100vw, 500px"
          className="h-auto w-full"
        />

        <p className="whitespace-pre-line px-4 text-center text-sm leading-7">
          {text}
        </p>
      </div>
    </section>
  );
}
