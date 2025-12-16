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
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-h2 text-text-primary mb-lg font-medium">Featured Products</h2>

          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
            role="status"
            aria-live="polite"
            aria-label="Loading featured products"
          >
            {/* Show 8 skeletons for featured products (2 cols mobile, 4 cols desktop) */}
            {[...Array(8)].map((_, i) => (
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
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-h2 text-text-primary mb-lg font-medium">Featured Products</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
