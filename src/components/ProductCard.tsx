'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { toggleWishlistItem, isProductInWishlist } from '@/lib/wishlist';
import { transformCloudinaryUrl } from '@/lib/cloudinary-client';

interface ProductCardProps {
  product: Product;
  showTechnicalSpecs?: boolean;
}

export default function ProductCard({ product, showTechnicalSpecs = false }: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check initial wishlist state
    setIsInWishlist(isProductInWishlist(product.id));

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setIsInWishlist(isProductInWishlist(product.id));
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [product.id]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product.id);
  };

  // Extract only voltage and wattage from specs
  const voltage = product.specs.voltage || product.specs.Voltage;
  const wattage = product.specs.wattage || product.specs.Wattage;

  // Optimize image URL with Cloudinary transformations
  const optimizedImageUrl = transformCloudinaryUrl(product.image, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });

  return (
    <article className="group relative border border-border rounded-2xl bg-surface hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer h-full flex flex-col overflow-hidden">
      {/* Image Container - Fixed aspect ratio matching wishlist */}
      <div className="relative w-full aspect-square bg-background overflow-hidden">
        <Link href={`/products/${product.id}`} className="relative block w-full h-full">
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

        {/* Wishlist Heart Icon - Top Right Corner */}
        <button
          type="button"
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
            isInWishlist
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={handleToggleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="w-5 h-5"
            fill={isInWishlist ? 'currentColor' : 'none'}
            strokeWidth={isInWishlist ? 0 : 2}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* Text Container - Matching wishlist layout */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Brand Name */}
        <p className="text-sm font-sans font-medium text-text-secondary uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Product Name - Fixed height container for consistency */}
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

        {/* Voltage and Wattage - Only shown when showTechnicalSpecs is true */}
        {showTechnicalSpecs && (voltage || wattage) && (
          <div className="flex gap-3 text-xs text-text-secondary">
            {voltage && <span className="font-medium">{voltage}</span>}
            {wattage && <span className="font-medium">{wattage}</span>}
          </div>
        )}

        {/* Price and CTA Container - Bottom of card */}
        <div className="mt-auto pt-3 border-t border-border space-y-3">
          {/* Price */}
          <p className="text-xl font-mono font-bold text-primary tabular-nums">
            ₦{product.price.toLocaleString('en-NG')}
          </p>

          {/* View Details Button */}
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
