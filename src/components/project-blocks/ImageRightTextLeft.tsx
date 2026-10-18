import Image from "next/image";

type Props = {
  image: string;
  text: string;
};

export default function ImageRightTextLeft({
  image,
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <p className="order-2 whitespace-pre-line leading-8 md:order-1">
          {text}
        </p>

        <Image
          src={image}
          alt=""
          width={1200}
          height={1600}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="order-1 h-auto w-full md:order-2"
        />
      </div>
    </section>
  );
}
