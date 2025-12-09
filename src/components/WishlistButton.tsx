'use client';

import { useState, useEffect } from 'react';
import { toggleWishlistItem, isProductInWishlist } from '@/lib/wishlist';

interface WishlistButtonProps {
  productId: string;
  productName: string;
}

export default function WishlistButton({ productId, productName }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check initial wishlist state
    setIsInWishlist(isProductInWishlist(productId));

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setIsInWishlist(isProductInWishlist(productId));
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [productId]);

  const handleToggleWishlist = () => {
    toggleWishlistItem(productId);
  };

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      className={`flex items-center justify-center gap-sm px-lg py-md min-h-touch rounded border-2 transition-all font-medium ${
        isInWishlist
          ? 'border-primary bg-primary text-white hover:bg-primary-dark'
          : 'border-primary text-primary hover:bg-primary/5'
      }`}
      aria-label={isInWishlist ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
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
      <span>{isInWishlist ? 'Saved' : 'Save for Later'}</span>
    </button>
  );
}
