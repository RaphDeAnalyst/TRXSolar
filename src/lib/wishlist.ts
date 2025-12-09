/**
 * Wishlist Management Utilities
 * Uses browser's Local Storage API to persist saved items
 */

const WISHLIST_STORAGE_KEY = 'vcsolar_wishlist';

/**
 * Retrieves the current array of product IDs from Local Storage
 * @returns Array of product IDs
 */
export function getWishlistItems(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    return [];
  }
}

/**
 * Adds or removes a product ID from the wishlist
 * @param productId - The product ID to toggle
 * @returns The updated wishlist array
 */
export function toggleWishlistItem(productId: string): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const wishlist = getWishlistItems();
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      // Remove if exists
      wishlist.splice(index, 1);
    } else {
      // Add if doesn't exist
      wishlist.push(productId);
    }

    // Update Local Storage
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new Event('wishlistUpdated'));

    return wishlist;
  } catch (error) {
    console.error('Error toggling wishlist item:', error);
    return getWishlistItems();
  }
}

/**
 * Checks if a product ID is in the wishlist
 * @param productId - The product ID to check
 * @returns Boolean indicating if product is saved
 */
export function isProductInWishlist(productId: string): boolean {
  if (typeof window === 'undefined') return false;

  const wishlist = getWishlistItems();
  return wishlist.includes(productId);
}

/**
 * Removes ALL saved product IDs from Local Storage
 * @returns Empty array
 */
export function clearWishlist(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    localStorage.removeItem(WISHLIST_STORAGE_KEY);

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new Event('wishlistUpdated'));

    return [];
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return getWishlistItems();
  }
}

/**
 * Gets the count of items in the wishlist
 * @returns Number of saved items
 */
export function getWishlistCount(): number {
  return getWishlistItems().length;
}
