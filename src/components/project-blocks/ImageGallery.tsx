import Image from "next/image";

type Props = {
  images: string[];
};

const COLUMNS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export default function ImageGallery({
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
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="h-auto max-h-[75vh] w-auto"
        />
      </section>
    );
  }

  const columns = images.length === 2 ? COLUMNS[2] : COLUMNS[3];
  const imageSizes =
    images.length === 2
      ? "(max-width: 768px) 100vw, 50vw"
      : "(max-width: 768px) 100vw, 33vw";

  return (
    <section
      className={`my-16 grid grid-cols-1 items-start gap-8 ${columns}`}
    >
      {images.map((image, index) => (
        <Image
          key={`${index}-${image}`}
          src={image}
          alt=""
          width={1200}
          height={1600}
          sizes={imageSizes}
          className="h-auto w-full"
        />
      ))}
    </section>
  );
}
