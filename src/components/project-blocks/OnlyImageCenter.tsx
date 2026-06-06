import Image from "next/image";

type Props = {
  images: string[];
};

export default function OnlyImageCenter({
  images,
}: Props) {
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <section className="my-16 flex justify-center">
        <Image
          src={images[0]}
          alt=""
          width={1800}
          height={1200}
          className="h-auto max-h-[75vh] w-auto"
        />
      </section>
    );
  }

  if (images.length === 2) {
    return (
      <section className="my-16 grid grid-cols-2 gap-8">
        {images.map((image) => (
          <Image
            key={image}
            src={image}
            alt=""
            width={1200}
            height={1600}
            className="h-auto w-full"
          />
        ))}
      </section>
    );
  }

  return (
    <section className="my-16 grid grid-cols-3 gap-8">
      {images.slice(0, 3).map((image) => (
        <Image
          key={image}
          src={image}
          alt=""
          width={1200}
          height={1600}
          className="h-auto w-full"
        />
      ))}
    </section>
  );
}