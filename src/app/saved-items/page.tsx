'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/skeletons/ProductCardSkeleton';
import { getWishlistItems, clearWishlist } from '@/lib/wishlist';
import { Product } from '@/lib/types';
import productsData from '@/data/products.json';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function SavedItemsPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbProductsLoaded, setDbProductsLoaded] = useState(false);

  useEffect(() => {
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      loadWishlistProducts();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);

    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  // Fetch ONLY wishlist products from database (optimized batch fetch)
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        // Get wishlist IDs from localStorage
        const wishlistIds = getWishlistItems();

        if (wishlistIds.length === 0) {
          console.log('[Saved Items] No wishlist items, skipping fetch');
          setDbProducts([]);
          setDbProductsLoaded(true);
          return;
        }

        console.log('[Saved Items] Fetching wishlist products:', wishlistIds);

        // Batch fetch only the products in the wishlist (PERFORMANCE OPTIMIZATION)
        const idsQuery = wishlistIds.join(',');
        const response = await fetch(`/api/products?ids=${encodeURIComponent(idsQuery)}&fields=card`);

        console.log('[Saved Items] Response status:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log('[Saved Items] API Response:', data);

          if (data.success && data.products) {
            console.log(`[Saved Items] ✅ Loaded ${data.products.length} wishlist products from database`);
            setDbProducts(data.products);
          } else {
            console.warn('[Saved Items] ⚠️ API returned success:false or no products array');
          }
        } else {
          const errorText = await response.text();
          console.error('[Saved Items] ❌ API request failed:', response.status, errorText);
        }
      } catch (error) {
        console.error('[Saved Items] ❌ Failed to load wishlist products:', error);
      } finally {
        setDbProductsLoaded(true);
      }
    };

    fetchWishlistProducts();
  }, []); // Only run once on mount

  const loadWishlistProducts = useCallback(() => {
    // Don't load wishlist until database products have been fetched
    if (!dbProductsLoaded) {
      return;
    }

    const wishlistIds = getWishlistItems();

    // Get all products - merge JSON and database products
    const allProducts: Product[] = [];

    // Add products from JSON file (backward compatibility)
    Object.values(productsData).forEach((categoryProducts) => {
      allProducts.push(...(categoryProducts as Product[]));
    });

    // Add products from database
    allProducts.push(...dbProducts);

    console.log('[Saved Items] Loading wishlist with', allProducts.length, 'total products');
    console.log('[Saved Items] Wishlist IDs:', wishlistIds);

    // Filter products that are in wishlist
    const savedProducts = allProducts.filter((product) =>
      wishlistIds.includes(product.id)
    );

    console.log('[Saved Items] Found', savedProducts.length, 'saved products');

    // Check for missing products
    const foundIds = savedProducts.map(p => p.id);
    const missingIds = wishlistIds.filter(id => !foundIds.includes(id));

    if (missingIds.length > 0) {
      console.warn('[Saved Items] ⚠️ Products not found:', missingIds);
      console.warn('[Saved Items] These products may have been deleted or are not yet loaded');
    }

    setWishlistItems(savedProducts);
    setLoading(false);
  }, [dbProducts, dbProductsLoaded]);

  // Reload wishlist when database products are loaded
  useEffect(() => {
    loadWishlistProducts();
  }, [loadWishlistProducts]);

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  const generateWhatsAppMessage = () => {
    const message = `Hi! I'm interested in the following products from VCSolar:\n\n${wishlistItems
      .map((product, index) => `${index + 1}. ${product.name} by ${product.brand} - ₦${product.price.toLocaleString('en-NG')}`)
      .join('\n')}\n\nCould you provide a quote for these items?`;

    const encodedMessage = encodeURIComponent(message);
    // WhatsApp number in international format (Nigerian number)
    // Format: country code (234) + mobile number without leading 0
    // Original local format: 0810 869 8673
    // International format: 234 810 869 8673 (no +, no spaces, no dashes)
    const phoneNumber = '2348108698673';

    // Using wa.me format (official WhatsApp click-to-chat link)
    // https://wa.me/<number>?text=<message>
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  const generateEmailLink = () => {
    const subject = `Quote Request for ${wishlistItems.length} Saved Items`;
    const body = `Hello VC Solar Team,\n\nI am interested in receiving a quote for the following products:\n\n${wishlistItems
      .map((product, index) => `${index + 1}. ${product.name} by ${product.brand}\n   Price: ₦${product.price.toLocaleString('en-NG')}\n   Category: ${product.category.replace('-', ' ')}`)
      .join('\n\n')}\n\nPlease provide your best quote for these items.\n\nThank you!`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:sales@vcsolar.com?subject=${encodedSubject}&body=${encodedBody}`;
  };

  // Loading State: Render Skeleton UI
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background">
        {/* Warning Banner - Shown even during loading */}
        <div className="bg-warning/10 border-b-2 border-warning">
          <div className="max-w-7xl mx-auto px-sm py-md">
            <div className="flex items-start gap-sm">
              <svg className="w-6 h-6 text-warning flex-shrink-0 mt-xs" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-body font-medium text-text-primary">
                  <strong>Important:</strong> Your saved items are stored only in this browser.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content with Skeleton */}
        <div className="max-w-7xl mx-auto px-sm py-lg">
          {/* Page Header */}
          <div className="mb-xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl text-text-primary font-bold mb-sm">Saved Items</h1>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Skeleton Product Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg"
            role="status"
            aria-live="polite"
            aria-label="Loading saved items"
          >
            {/* Show 4 skeletons (responsive) */}
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Warning Banner */}
      <div className="bg-warning/10 border-b-2 border-warning">
        <div className="max-w-7xl mx-auto px-sm py-md">
          <div className="flex items-start gap-sm">
            <svg className="w-6 h-6 text-warning flex-shrink-0 mt-xs" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-body font-medium text-text-primary">
                <strong>Important:</strong> Your saved items are stored only in this browser. If you clear your
                browser's history, cache, or switch to a different device, your current Wishlist will be permanently
                deleted.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-sm py-lg">
        {/* Page Header */}
        <div className="mb-xl">
          <h1 className="text-h1 text-text-primary font-bold mb-sm">Saved Items</h1>
          <p className="text-body text-text-secondary">
            {wishlistItems.length > 0
              ? `You have ${wishlistItems.length} ${wishlistItems.length === 1 ? 'item' : 'items'} saved`
              : 'Your wishlist is empty'}
          </p>
        </div>

        {/* Management Controls */}
        {wishlistItems.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-md mb-xl">
            {/* Request Quote Buttons - Vertical Stack on Mobile */}
            <div className="flex flex-col sm:flex-row gap-sm flex-1">
              {/* Primary CTA: WhatsApp Quote */}
              <a
                href={generateWhatsAppMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 bg-primary text-white px-6 py-3 min-h-[48px] font-display font-semibold hover:bg-primary-dark transition-colors rounded-lg shadow-md text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Quote
              </a>

              {/* Secondary CTA: Email Quote */}
              <a
                href={generateEmailLink()}
                className="w-full sm:flex-1 border-2 border-primary text-primary px-6 py-3 min-h-[48px] font-display font-semibold hover:bg-primary/10 transition-colors rounded-lg text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Quote
              </a>
            </div>

            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              className="px-lg py-md min-h-touch font-medium border-2 border-error text-error hover:bg-error/10 transition-colors rounded"
            >
              Clear All Saved Items
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-2xl">
            <svg
              className="w-24 h-24 mx-auto text-text-secondary mb-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-text-primary font-medium mb-sm">Your wishlist is empty</h2>
            <p className="text-body text-text-secondary mb-lg max-w-md mx-auto">
              Start saving products you're interested in by clicking the heart icon on any product card.
            </p>
            <Link
              href="/products"
              className="inline-block bg-primary text-white px-xl py-md min-h-touch font-medium hover:bg-primary-dark transition-colors rounded shadow-md"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>

      {/* Confirm Clear All Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Saved Items?"
        message="Are you sure you want to remove all saved items? This action cannot be undone."
        confirmText="Clear All"
        confirmVariant="danger"
      />
    </div>
  );
}
