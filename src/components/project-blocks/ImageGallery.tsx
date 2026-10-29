import LightboxImage from "@/components/LightboxImage";
import { SIZES_FULL, SIZES_GALLERY_2, SIZES_GALLERY_3, lcpProps } from "@/lib/image-sizes";

type Props = {
  images: string[];
  projectTitle: string;
  lcp?: boolean;
};

const COLUMNS = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export default function ImageGallery({
  images,
  projectTitle,
  lcp,
}: Props) {
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <section className="my-24">
        <LightboxImage
          src={images[0]}
          alt={`${projectTitle} — photograph 1`}
          width={2000}
          height={1333}
          sizes={SIZES_FULL}
          {...lcpProps(lcp)}
          className="h-auto max-h-[85vh] w-full object-contain"
        />
      </section>
    );
  }

  const columns = images.length === 2 ? COLUMNS[2] : COLUMNS[3];
  const imageSizes = images.length === 2 ? SIZES_GALLERY_2 : SIZES_GALLERY_3;

  return (
    <section
      className={`my-24 grid grid-cols-1 items-start gap-6 ${columns}`}
    >
      {images.map((image, index) => (
        <LightboxImage
          key={`${index}-${image}`}
          src={image}
          alt={`${projectTitle} — photograph ${index + 1}`}
          width={1200}
          height={1600}
          sizes={imageSizes}
          {...lcpProps(lcp && index === 0)}
          className="h-auto w-full"
        />
      ))}
    </section>
  );
}
