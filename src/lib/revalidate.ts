import "server-only";
import { revalidatePath } from "next/cache";

/**
 * Call after every admin write. Pages are rendered per request anyway; this also
 * refreshes Next's client router cache so the site and the admin show new data
 * immediately. There are two root layouts (site and admin), so revalidate both.
 */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}
