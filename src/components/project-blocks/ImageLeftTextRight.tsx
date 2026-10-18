import Image from "next/image";

type Props = {
  image: string;
  text: string;
};

export default function ImageLeftTextRight({
  image,
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Image
          src={image}
          alt=""
          width={1200}
          height={1600}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="h-auto w-full"
        />

        <p className="whitespace-pre-line leading-8">
          {text}
        </p>
      </div>
    </section>
  );
}
