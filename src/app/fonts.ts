import { Albert_Sans, Montserrat } from "next/font/google";

// The one text typeface of the public site.
export const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

// Used only for the logo (photographer name).
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});
