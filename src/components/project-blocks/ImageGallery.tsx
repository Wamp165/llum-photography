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
      <section className="my-24">
        <Image
          src={images[0]}
          alt=""
          width={2000}
          height={1333}
          sizes="(max-width: 1100px) 100vw, 1020px"
          className="h-auto max-h-[85vh] w-full object-contain"
        />
      </section>
    );
  }

  const columns = images.length === 2 ? COLUMNS[2] : COLUMNS[3];
  const imageSizes =
    images.length === 2
      ? "(max-width: 768px) 100vw, 500px"
      : "(max-width: 768px) 100vw, 330px";

  return (
    <section
      className={`my-24 grid grid-cols-1 items-start gap-6 ${columns}`}
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
