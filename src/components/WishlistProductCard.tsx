'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { toggleWishlistItem } from '@/lib/wishlist';
import { transformCloudinaryUrl } from '@/lib/cloudinary-client';

interface WishlistProductCardProps {
  product: Product;
}

export default function WishlistProductCard({ product }: WishlistProductCardProps) {
  const handleRemoveItem = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product.id);
  };

  // Optimize image URL with Cloudinary transformations
  const optimizedImageUrl = transformCloudinaryUrl(product.image, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });

  return (
    <article className="group relative border border-border rounded-2xl bg-surface hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer h-full flex flex-col overflow-hidden">
      {/* Image Container - Fixed aspect ratio for uniform height */}
      <div className="relative w-full aspect-square bg-background overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={optimizedImageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 400px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
            priority={product.featured}
            loading={product.featured ? 'eager' : 'lazy'}
          />
        </Link>

        {/* Bin Icon - Top Right Corner */}
        <button
          type="button"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-surface shadow-md flex items-center justify-center text-text-primary hover:bg-error hover:text-surface transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={handleRemoveItem}
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Text Container - Minimal: Brand, Name, Price only */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Brand Name - Prominent, above title */}
        <p className="text-sm font-sans font-medium text-text-secondary uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Product Name - Fixed height container reserves space for exactly 2 lines */}
        <div className="h-[2.5rem] md:h-[3rem]">
          <Link href={`/products/${product.id}`}>
            <h3
              className="text-sm md:text-base font-bold text-text-primary line-clamp-2 leading-tight hover:text-primary transition-colors"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price and CTA Container - Bottom of card */}
        <div className="mt-auto pt-3 border-t border-border space-y-3">
          {/* Price - Teal/Turquoise color, large and bold */}
          <p className="text-xl font-mono font-bold text-primary tabular-nums">
            ₦{product.price.toLocaleString('en-NG')}
          </p>

          {/* View Details Button - Consistent with global style */}
          <Link
            href={`/products/${product.id}`}
            className="block w-full text-center px-4 py-3 min-h-[48px] bg-primary text-surface text-sm font-display font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
