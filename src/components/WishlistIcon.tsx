'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getWishlistCount } from '@/lib/wishlist';

export default function WishlistIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial count
    setCount(getWishlistCount());

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setCount(getWishlistCount());
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  return (
    <Link
      href="/saved-items"
      className="relative flex items-center justify-center min-h-touch min-w-touch hover:opacity-80 transition-opacity"
      aria-label={`View saved items (${count})`}
    >
      {/* Heart Icon */}
      <svg
        className="w-6 h-6 text-white"
        fill={count > 0 ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={count > 0 ? 0 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      {/* Count Badge */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
