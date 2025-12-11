'use client';

import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton';

interface FeaturedProductsSectionProps {
  products: Product[];
  isLoading?: boolean;
}

export default function FeaturedProductsSection({ products, isLoading }: FeaturedProductsSectionProps) {
  // Loading State: Render Skeleton UI
  if (isLoading) {
    return (
      <section className="py-lg px-sm bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 text-text-primary mb-lg font-medium">Featured Products</h2>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md"
            role="status"
            aria-live="polite"
            aria-label="Loading featured products"
          >
            {/* Show 6 skeletons for featured products (responsive: 1 col mobile, 2 tablet, 3 desktop) */}
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No Results State: Don't render section if no featured products
  if (!isLoading && products.length === 0) {
    return null;
  }

  // Success State: Render actual featured products
  return (
    <section className="py-lg px-sm bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-h2 text-text-primary mb-lg font-medium">Featured Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
