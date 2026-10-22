import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_CACHE_TAG } from "@/lib/site-cache";

/**
 * Call after every admin write. Expires the cached public reads right away (the next
 * request reads the database again) and refreshes Next's client router cache so the site
 * and the admin show new data immediately. There are two root layouts (site and admin),
 * so revalidate both.
 */
export function revalidateSite(): void {
  revalidateTag(SITE_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}
