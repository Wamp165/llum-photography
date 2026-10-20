import "server-only";
import { unstable_cache } from "next/cache";

/** One tag for every cached public read; `revalidateSite()` expires it after any admin write. */
export const SITE_CACHE_TAG = "site";

/** Safety net for changes made outside the admin (e.g. directly in the database). */
const FALLBACK_REVALIDATE_SECONDS = 60 * 60;

/**
 * Caches a public read in Next's data cache. Arguments are part of the cache key.
 * `keyPrefix` must be unique per function. Results are stored as JSON, so return plain data.
 */
export function cachedSiteRead<Args extends unknown[], Result>(
  keyPrefix: string,
  read: (...args: Args) => Promise<Result>
): (...args: Args) => Promise<Result> {
  const cached = unstable_cache(read, [keyPrefix], {
    tags: [SITE_CACHE_TAG],
    revalidate: FALLBACK_REVALIDATE_SECONDS,
  });

  return async (...args) => {
    try {
      return await cached(...args);
    } catch (error) {
      // Scripts (smoke test, seed) run outside Next and have no data cache: read directly.
      if (error instanceof Error && error.message.includes("incrementalCache missing")) {
        return await read(...args);
      }
      throw error;
    }
  };
}
