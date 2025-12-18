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
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-300"
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

  // Success State: Render actual product cards with smooth transitions
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-300">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
