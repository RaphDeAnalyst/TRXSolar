import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  // Loading State: Render Skeleton UI
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md"
        role="status"
        aria-live="polite"
        aria-label="Loading products"
      >
        {/* Show 8 skeletons on desktop, 6 on tablet, 4 on mobile (responsive) */}
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No Results State: Only shown when NOT loading and no products found
  if (!isLoading && products.length === 0) {
    return (
      <div className="col-span-full py-2xl text-center">
        <p className="text-body text-text-secondary">No products found. Try adjusting your filters.</p>
      </div>
    );
  }

  // Success State: Render actual product cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
