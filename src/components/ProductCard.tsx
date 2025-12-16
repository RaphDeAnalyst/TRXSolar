'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { toggleWishlistItem, isProductInWishlist } from '@/lib/wishlist';
import { transformCloudinaryUrl } from '@/lib/cloudinary-client';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  // Extract key specs to display (limit to 2-3 most important)
  const displaySpecs = Object.entries(product.specs)
    .slice(0, 3)
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: value.toString(),
    }));

  // Optimize image URL with Cloudinary transformations
  const optimizedImageUrl = transformCloudinaryUrl(product.image, {
    width: 600,
    quality: 'auto',
    format: 'auto',
    crop: 'limit'
  });

  return (
    <article className="bg-surface hover:shadow-lg cursor-pointer transition-shadow h-full flex flex-col">
      {/* Image Container - 4:5 aspect ratio */}
      <div className="relative w-full aspect-[4/5] bg-background overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={optimizedImageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 400px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={product.featured}
            loading={product.featured ? 'eager' : 'lazy'}
          />
        </Link>

        {/* Wishlist Heart Icon */}
        <button
          type="button"
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
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

      {/* Text Container - Enhanced with specifications */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Brand Name - Prominent, above title */}
        <p className="text-sm font-sans font-medium text-gray-500 uppercase tracking-wide">
          {product.brand}
        </p>

        {/* Product Name - Larger, bolder */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-sans font-semibold text-text-primary line-clamp-2 leading-snug hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Specifications - Compact display */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
          {displaySpecs.map((spec, index) => (
            <span key={index} className="bg-gray-100 px-2 py-1 rounded">
              {spec.label}: <span className="font-semibold">{spec.value}</span>
            </span>
          ))}
        </div>

        {/* Price and CTA Container - Bottom of card */}
        <div className="mt-auto pt-3 border-t border-border space-y-3">
          {/* Price - Teal/Turquoise color, large and bold */}
          <p className="text-xl font-mono font-bold text-primary tabular-nums">
            ₦{product.price.toLocaleString('en-NG')}
          </p>

          {/* View Details Button - Full width on mobile, auto width on desktop */}
          <Link
            href={`/products/${product.id}`}
            className="w-full md:w-auto inline-block text-center px-4 py-3 min-h-touch bg-primary text-white text-sm font-sans font-semibold rounded hover:bg-primary-dark transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
