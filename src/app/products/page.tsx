'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import productsData from '@/data/products.json';
import { Product, ProductCategory } from '@/lib/types';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'solar-panels', label: 'Solar Panels' },
  { value: 'inverters', label: 'Inverters' },
  { value: 'batteries', label: 'Batteries' },
  { value: 'accessories', label: 'Accessories' },
];

// Helper function to round up prices to user-friendly values
function roundUpPrice(price: number): number {
  if (price === 0) return 10000; // Default minimum

  // Determine the magnitude to round to
  if (price <= 1000) return Math.ceil(price / 100) * 100; // Round to nearest 100
  if (price <= 10000) return Math.ceil(price / 1000) * 1000; // Round to nearest 1,000
  if (price <= 100000) return Math.ceil(price / 10000) * 10000; // Round to nearest 10,000
  return Math.ceil(price / 100000) * 100000; // Round to nearest 100,000
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<ProductCategory | null>(
    (searchParams.get('category') as ProductCategory) || null
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);

  // Get all products
  const allProducts = useMemo(() => {
    const products: Product[] = [];
    Object.values(productsData).forEach((categoryProducts) => {
      products.push(...categoryProducts);
    });
    return products;
  }, []);

  // Get unique brands based on selected category (dynamic, category-dependent)
  const uniqueBrands = useMemo(() => {
    let productsToConsider = allProducts;

    // If category is selected, only get brands from that category
    if (category) {
      productsToConsider = allProducts.filter((p) => p.category === category);
    }

    // Extract unique brand names and sort alphabetically
    return Array.from(new Set(productsToConsider.map((p) => p.brand))).sort();
  }, [allProducts, category]);

  // Get max price
  const maxPrice = useMemo(() => {
    return Math.max(...allProducts.map((p) => p.price));
  }, [allProducts]);

  // Calculate max price based on current category (dynamically adjusts)
  const categoryMaxPrice = useMemo(() => {
    let productsToConsider = allProducts;

    // If category is selected, only consider products in that category
    if (category) {
      productsToConsider = allProducts.filter((p) => p.category === category);
    }

    // Get the highest price
    if (productsToConsider.length === 0) return 10000; // Default if no products
    const maxPrice = Math.max(...productsToConsider.map((p) => p.price));

    // Round up to nice round number
    return roundUpPrice(maxPrice);
  }, [allProducts, category]);

  // Reset price range and brand selections when category changes
  useEffect(() => {
    setPriceRange([0, categoryMaxPrice]);
    // Clear brand selections when switching categories to avoid showing irrelevant filters
    setBrands(new Set());
  }, [category, categoryMaxPrice]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by brands
    if (brands.size > 0) {
      filtered = filtered.filter((p) => brands.has(p.brand));
    }

    return filtered.sort((a, b) => a.price - b.price);
  }, [allProducts, category, priceRange, brands]);

  const handleBrandToggle = (brand: string) => {
    const newBrands = new Set(brands);
    if (newBrands.has(brand)) {
      newBrands.delete(brand);
    } else {
      newBrands.add(brand);
    }
    setBrands(newBrands);
  };

  const handleClearFilters = () => {
    setCategory(null);
    setPriceRange([0, categoryMaxPrice]);
    setBrands(new Set());
  };

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto px-xs py-lg">
        {/* Floating Filter Toggle Button (when collapsed) */}
        {!showFilters && (
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="hidden md:flex fixed left-4 top-24 z-40 items-center gap-xs px-md py-sm bg-primary text-surface hover:bg-primary-dark transition-colors rounded shadow-lg"
            aria-label="Show filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-body font-medium">Filters</span>
          </button>
        )}
        <div className="flex flex-col md:flex-row gap-lg">
          {/* Filters - Desktop Sidebar */}
          {showFilters && (
            <aside className="hidden md:block w-full md:w-64 flex-shrink-0 transition-all duration-300">
              <div className="sticky top-20 space-y-md">
              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between p-sm bg-background hover:bg-border transition-colors rounded mb-md"
                aria-label="Toggle filters"
              >
                <span className="text-body font-medium text-text-primary">Filters</span>
                <svg
                  className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Category Filter */}
              <div>
                <h3 className="text-body font-medium text-text-primary mb-sm">Category</h3>
                <div className="space-y-sm">
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className={`block w-full text-left text-caption p-sm rounded transition-colors ${
                      category === null ? 'bg-primary text-surface' : 'hover:bg-background'
                    }`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`block w-full text-left text-caption p-sm rounded transition-colors ${
                        category === cat.value ? 'bg-primary text-surface' : 'hover:bg-background'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-md border-t border-border">
                <h3 className="text-body font-medium text-text-primary mb-sm">Price Range</h3>
                <div className="space-y-sm">
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                    aria-label="Maximum price"
                  />
                  <div className="text-caption text-text-secondary">
                    ₦{priceRange[0].toLocaleString('en-NG')} - ₦{priceRange[1].toLocaleString('en-NG')}
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              {uniqueBrands.length > 0 ? (
                <div className="pt-md border-t border-border">
                  <h3 className="text-body font-medium text-text-primary mb-sm">Brand</h3>
                  <div className="space-y-sm max-h-48 overflow-y-auto">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={brands.has(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-4 h-4"
                        />
                        <span className="text-caption text-text-primary">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-md border-t border-border">
                  <h3 className="text-body font-medium text-text-primary mb-sm">Brand</h3>
                  <p className="text-caption text-text-secondary italic">
                    No specific brands listed for this category.
                  </p>
                </div>
              )}

              {/* Clear Filters */}
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full text-caption text-primary hover:text-primary-dark font-medium pt-md border-t border-border"
              >
                Clear All Filters
              </button>
              </div>
            </aside>
          )}

          {/* Products Section */}
          <div className="flex-1 min-w-0">
            {/* Filter Summary */}
            <div className="mb-lg flex flex-wrap gap-sm items-center">
              <span className="text-caption text-text-secondary">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>

              {/* Active Filters - Mobile */}
              <div className="flex flex-wrap gap-sm md:hidden">
                {category && (
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className="text-xs bg-background px-sm py-xs rounded flex items-center gap-xs hover:bg-border"
                  >
                    {CATEGORIES.find((c) => c.value === category)?.label}
                    <span>✕</span>
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} />

            {/* CTA Section */}
            <div className="mt-2xl bg-primary/10 border border-primary/20 rounded-lg p-xl text-center">
              <h3 className="text-h3 text-text-primary font-medium mb-sm">Need Help Choosing?</h3>
              <p className="text-body text-text-secondary mb-lg max-w-2xl mx-auto">
                Our solar experts can help you find the perfect system for your needs and provide a personalized quote.
              </p>
              <Link
                href="/quote"
                className="inline-block bg-primary text-surface px-xl py-md min-h-touch font-medium hover:bg-primary-dark transition-colors shadow-md rounded"
              >
                Get Your Free Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
