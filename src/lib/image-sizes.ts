// `sizes` attributes of the public images, from the rendered width of each one.
// The content column is `site-container` (src/app/(site)/globals.css): 100vw minus 1.5rem
// padding per side below 768px, minus 2.5rem per side up to 1100px, then a fixed 1020px.
// Breakpoints are Tailwind's: md 768px, lg 1024px, xl 1280px.

/** Full width of the content column. */
export const SIZES_FULL =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc(100vw - 5rem), 1020px";

/** Home page hero: the photo fills the whole viewport width. */
export const SIZES_HERO = "100vw";

/** Two columns from md with a 2.5rem gap (image + text blocks). */
export const SIZES_HALF_GAP_10 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 7.5rem) / 2), 490px";

// Category layouts use `site-container-wide`: 1.25rem per side below 768px, 4.25rem from md,
// no max width. Their cards are `fill` + `object-cover`, so these are the box widths.

/** One card across the wide column (Showcase). */
export const SIZES_WIDE_FULL =
  "(max-width: 767px) calc(100vw - 2.5rem), calc(100vw - 8.5rem)";

/** Carousel: cover on the left, 3fr of 3fr + 2fr from md, 2.5rem gap. */
export const SIZES_WIDE_CAROUSEL =
  "(max-width: 767px) calc(100vw - 2.5rem), calc((100vw - 11rem) * 0.6)";

/** One column, two from md, three from lg, 1.5rem gaps (Grid). */
export const SIZES_WIDE_THIRD =
  "(max-width: 767px) calc(100vw - 2.5rem), (max-width: 1023px) calc((100vw - 10rem) / 2), calc((100vw - 11.5rem) / 3)";

/** Two columns from md with a 4rem gap (About page). */
export const SIZES_HALF_GAP_16 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 9rem) / 2), 478px";

/** Image gallery with 2 images: two columns from md, 1.5rem gap. */
export const SIZES_GALLERY_2 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 6.5rem) / 2), 498px";

/** Image gallery with 3 images: three columns from md, 1.5rem gap. */
export const SIZES_GALLERY_3 =
  "(max-width: 767px) calc(100vw - 3rem), (max-width: 1100px) calc((100vw - 8rem) / 3), 324px";

/** Carousel with arrows: the image box has `mx-10` below xl, so 5rem less than the column. */
export const SIZES_CAROUSEL =
  "(max-width: 767px) calc(100vw - 8rem), (max-width: 1100px) calc(100vw - 10rem), (max-width: 1279px) 940px, 1020px";

/**
 * Full-screen lightbox: 1rem padding per side and `max-h-[92vh]`. A 3:2 photo is at most
 * 92vh * 1.5 = 138vh wide, so asking for more than that only downloads unseen pixels.
 */
export const SIZES_LIGHTBOX = "min(calc(100vw - 2rem), 138vh)";

/**
 * Props for the first visible photo of a page (the likely LCP element): fetched right
 * away with high priority. Every other image keeps next/image's default lazy loading.
 */
export function lcpProps(lcp: boolean | undefined) {
  return lcp ? ({ loading: "eager", fetchPriority: "high" } as const) : {};
}
