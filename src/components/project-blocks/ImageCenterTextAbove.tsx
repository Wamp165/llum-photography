import Image from "next/image";

type Props = {
  image: string;
  text: string;
};

export default function ImageCenterTextAbove({
  image,
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="mx-auto mb-10 max-w-2xl">
        <p className="whitespace-pre-line leading-8">
          {text}
        </p>
      </div>

      <div className="flex justify-center">
        <Image
          src={image}
          alt=""
          width={1800}
          height={1200}
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="h-auto max-h-[75vh] w-auto"
        />
      </div>
    </section>
  );
}