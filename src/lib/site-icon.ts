import { withCloudinaryTransformation } from "./cloudinary-url";

export type SiteIconSize = 32 | 180 | 192 | 512;

/**
 * Square PNG of the favicon served by Cloudinary. c_pad keeps the whole image and fills
 * the rest with white: never cropped, even if the upload is not square.
 */
export function siteIconUrl(favicon: string, size: SiteIconSize): string {
  return withCloudinaryTransformation(favicon, `f_png,c_pad,b_white,w_${size},h_${size}`);
}
