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
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        role="status"
        aria-live="polite"
        aria-label="Loading products"
      >
        {/* Show 8 skeletons (2 cols mobile, 4 cols desktop) */}
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
