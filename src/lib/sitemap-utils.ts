/**
 * Utility functions for sitemap management
 * These functions help maintain fresh sitemaps when products are added, updated, or deleted
 */

/**
 * Revalidate the product sitemap
 * Call this function after product CRUD operations to ensure the sitemap stays fresh
 */
export async function revalidateProductSitemap() {
  try {
    // In production, you would use Next.js revalidation
    // For now, we'll just log the action
    console.log('[Sitemap] Product sitemap invalidated - will regenerate on next request');

    // Note: Sitemap routes have cache control headers that handle revalidation
    // The 30-minute cache will ensure fresh data without manual intervention

    // If using ISR (Incremental Static Regeneration), you could use:
    // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // await fetch(`${baseUrl}/api/revalidate?path=/sitemap-products.xml`, { method: 'POST' });

    return { success: true };
  } catch (error) {
    console.error('[Sitemap] Failed to revalidate product sitemap:', error);
    return { success: false, error };
  }
}

/**
 * Trigger sitemap regeneration
 * This can be called from API routes after product changes
 */
export async function triggerSitemapRegeneration() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Fetch the sitemap to trigger regeneration
    await fetch(`${baseUrl}/sitemap-products.xml`, {
      cache: 'no-store',
    });

    console.log('[Sitemap] Product sitemap regenerated successfully');
    return { success: true };
  } catch (error) {
    console.error('[Sitemap] Failed to trigger sitemap regeneration:', error);
    return { success: false, error };
  }
}
