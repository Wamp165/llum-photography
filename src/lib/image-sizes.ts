// `sizes` attributes of the public images, from the rendered width of each one.
// The content column is `site-container` (src/app/(site)/globals.css): 100vw minus 1.5rem
// padding per side below 768px, minus 2.5rem per side up to 1100px, then a fixed 1020px.
// Breakpoints are Tailwind's: md 768px, lg 1024px, xl 1280px.

/** Full width of the content column. */
export const SIZES_FULL =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc(100vw - 5rem), 1020px";

/** Two columns from md with a 2.5rem gap (Editorial, image + text blocks). */
export const SIZES_HALF_GAP_10 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 7.5rem) / 2), 490px";

/** Two columns from md with a 4rem gap (About page). */
export const SIZES_HALF_GAP_16 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 9rem) / 2), 478px";

/** Two columns from md with a 3rem gap (Featured). */
export const SIZES_HALF_GAP_12 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 8rem) / 2), 486px";

/** One column, two from md, three from lg, 3rem gaps (Grid, Masonry). */
export const SIZES_GRID =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) calc((100vw - 8rem) / 2), (max-width: 1100px) calc((100vw - 11rem) / 3), 308px";

/** Image gallery with 2 images: two columns from md, 1.5rem gap. */
export const SIZES_GALLERY_2 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 6.5rem) / 2), 498px";

/** Image gallery with 3 images: three columns from md, 1.5rem gap. */
export const SIZES_GALLERY_3 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 8rem) / 3), 324px";

/** Carousel with arrows: the image box has `mx-10` below xl, so 5rem less than the column. */
export const SIZES_CAROUSEL =
  "(max-width: 767px) calc(100vw - 8rem), (max-width: 1100px) calc(100vw - 10rem), (max-width: 1279px) 940px, 1020px";

/** Full-screen lightbox: the image can fill the viewport width. */
export const SIZES_LIGHTBOX = "100vw";

/**
 * Props for the first visible photo of a page (the likely LCP element): fetched right
 * away with high priority. Every other image keeps next/image's default lazy loading.
 */
export function lcpProps(lcp: boolean | undefined) {
  return lcp ? ({ loading: "eager", fetchPriority: "high" } as const) : {};
}
