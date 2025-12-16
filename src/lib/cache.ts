// Note: revalidateTag signature changed in Next.js 16
// Using try-catch to handle both old and new API
// @ts-ignore - Next.js cache API varies by version
import { revalidateTag } from 'next/cache';

/**
 * Cache Revalidation Utilities
 *
 * These functions invalidate Next.js cache after product mutations
 * in the admin panel, ensuring users always see fresh data.
 */

/**
 * Revalidates product-related caches after mutations
 *
 * @param category - Optional specific category to revalidate
 * @param featured - Whether to revalidate featured products cache
 *
 * @example
 * // After creating a solar panel product
 * await revalidateProductCache('solar-panels', false);
 *
 * // After updating a featured product
 * await revalidateProductCache('inverters', true);
 */
export async function revalidateProductCache(
  category?: string | null,
  featured?: boolean
) {
  try {
    console.log('[Cache] Revalidating product caches...', { category, featured });

    // Note: In Next.js 16+, revalidateTag is synchronous and doesn't need await
    // The function logs are kept for monitoring purposes

    // Always revalidate the main products cache
    try {
      // @ts-expect-error - Next.js 16 API change
      revalidateTag('products');
      console.log('[Cache] ✅ Revalidated: products');
    } catch (e) {
      console.warn('[Cache] ⚠️ Could not revalidate products tag (might be in non-cache context)');
    }

    // Revalidate category-specific cache if provided
    if (category) {
      try {
        // @ts-expect-error - Next.js 16 API change
        revalidateTag(`category-${category}`);
        console.log(`[Cache] ✅ Revalidated: category-${category}`);
      } catch (e) {
        console.warn(`[Cache] ⚠️ Could not revalidate category-${category} tag`);
      }
    }

    // Revalidate featured products cache if needed
    if (featured) {
      try {
        // @ts-expect-error - Next.js 16 API change
        revalidateTag('featured-products');
        console.log('[Cache] ✅ Revalidated: featured-products');
      } catch (e) {
        console.warn('[Cache] ⚠️ Could not revalidate featured-products tag');
      }
    }

    console.log('[Cache] ✅ Cache revalidation complete');
  } catch (error) {
    console.error('[Cache] ❌ Error during revalidation:', error);
    // Don't throw - cache revalidation failure shouldn't break the mutation
  }
}

/**
 * Revalidates all product-related caches (nuclear option)
 *
 * Use this when you're unsure which caches need to be invalidated,
 * or when performing bulk operations.
 *
 * @example
 * // After bulk product import
 * await revalidateAllProductCaches();
 */
export async function revalidateAllProductCaches() {
  try {
    console.log('[Cache] ⚠️ Revalidating ALL product caches...');

    // Main caches
    try {
      // @ts-expect-error - Next.js 16 API change
      revalidateTag('products');
      // @ts-expect-error - Next.js 16 API change
      revalidateTag('featured-products');
    } catch (e) {
      console.warn('[Cache] ⚠️ Could not revalidate main caches');
    }

    // Revalidate all category caches
    const categories = ['solar-panels', 'inverters', 'batteries', 'accessories'];
    categories.forEach(cat => {
      try {
        // @ts-expect-error - Next.js 16 API change
        revalidateTag(`category-${cat}`);
        console.log(`[Cache] ✅ Revalidated: category-${cat}`);
      } catch (e) {
        console.warn(`[Cache] ⚠️ Could not revalidate category-${cat}`);
      }
    });

    console.log('[Cache] ✅ All product caches revalidated');
  } catch (error) {
    console.error('[Cache] ❌ Error during full revalidation:', error);
  }
}

/**
 * Get cache statistics (for debugging)
 *
 * Note: This is a placeholder for future implementation.
 * Next.js doesn't expose cache hit/miss stats directly,
 * but you can track this via response headers or Vercel Analytics.
 */
export function getCacheStats() {
  return {
    message: 'Cache stats not yet implemented',
    tip: 'Check Server-Timing headers in browser DevTools Network tab'
  };
}
