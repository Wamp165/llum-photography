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
      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex items-center">
          <p className="whitespace-pre-line leading-8">
            {text}
          </p>
        </div>

        <div>
          <Image
            src={image}
            alt=""
            width={1200}
            height={1600}
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}