/**
 * Product Card Skeleton Loader
 *
 * A skeleton UI component that mimics the structure of ProductCard.
 * Used to provide visual feedback during loading and prevent layout shifts.
 *
 * Design adherence:
 * - Uses neutral gray tones from design_system.md
 * - Mirrors ProductCard structure: image block, brand, title, specs, price, button
 * - Includes subtle shimmer animation to signal active loading
 * - Responsive: adapts to grid layout per responsive_ux_guide.md
 */

export default function ProductCardSkeleton() {
  return (
    <article
      className="bg-surface h-full flex flex-col animate-pulse"
      aria-label="Loading product"
      role="status"
    >
      {/* Image Container - 4:5 aspect ratio matching ProductCard */}
      <div className="relative w-full aspect-[4/5] bg-gray-200 overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />

        {/* Wishlist button skeleton */}
        <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gray-300" />
      </div>

      {/* Text Container - matching ProductCard padding and structure */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Brand Name skeleton */}
        <div className="h-4 w-20 bg-gray-200 rounded" />

        {/* Product Name skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
        </div>

        {/* Specifications skeleton - 3 small pills */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-100 rounded" />
          <div className="h-6 w-20 bg-gray-100 rounded" />
          <div className="h-6 w-24 bg-gray-100 rounded" />
        </div>

        {/* Price and CTA Container - Bottom of card */}
        <div className="mt-auto pt-3 border-t border-border space-y-3">
          {/* Price skeleton */}
          <div className="h-7 w-32 bg-gray-200 rounded" />

          {/* Button skeleton */}
          <div className="w-full h-12 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading product information...</span>
    </article>
  );
}
