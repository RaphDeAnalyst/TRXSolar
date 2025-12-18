'use client';

import { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Product, ProductCategory, Category } from '@/lib/types';

const PriceRangeSlider = dynamic(
  () => import('@/components/PriceRangeSlider'),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 flex items-center justify-center">
        <div className="animate-pulse bg-border rounded-lg h-16 w-full" />
      </div>
    ),
  }
);

interface ProductFilterPanelProps {
  // Filter state
  category: ProductCategory | null;
  priceRange: [number, number];
  brands: Set<string>;

  // Filter setters
  onCategoryChange: (category: ProductCategory | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onBrandsChange: (brands: Set<string>) => void;

  // Data for dynamic filters
  allProducts: Product[];
  uniqueBrands: string[];

  // Mobile state
  isOpen: boolean;
  onClose: () => void;

  // Results count for "Show Results" button
  filteredCount: number;
}

// Helper function to round up prices to user-friendly values
function roundUpPrice(price: number): number {
  if (price === 0) return 10000;
  if (price <= 1000) return Math.ceil(price / 100) * 100;
  if (price <= 10000) return Math.ceil(price / 1000) * 1000;
  if (price <= 100000) return Math.ceil(price / 10000) * 10000;
  return Math.ceil(price / 100000) * 100000;
}

export default function ProductFilterPanel({
  category,
  priceRange,
  brands,
  onCategoryChange,
  onPriceRangeChange,
  onBrandsChange,
  allProducts,
  uniqueBrands,
  isOpen,
  onClose,
  filteredCount,
}: ProductFilterPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Calculate dynamic max price based on selected category
  const maxPrice = useMemo(() => {
    let productsToConsider = allProducts;

    if (category) {
      productsToConsider = allProducts.filter((p) => p.category === category);
    }

    const prices = productsToConsider.map((p) => p.price);
    const max = prices.length > 0 ? Math.max(...prices) : 10000;
    return roundUpPrice(max);
  }, [allProducts, category]);

  // Handle category change (reset dependent filters)
  const handleCategoryChange = (cat: ProductCategory | null) => {
    onCategoryChange(cat);
    // Reset price range when category changes
    onPriceRangeChange([0, maxPrice]);
    // Reset brands when category changes
    onBrandsChange(new Set());
  };

  // Handle brand toggle
  const handleBrandToggle = (brand: string) => {
    const newBrands = new Set(brands);
    if (newBrands.has(brand)) {
      newBrands.delete(brand);
    } else {
      newBrands.add(brand);
    }
    onBrandsChange(newBrands);
  };

  // Clear all filters
  const handleClearFilters = () => {
    onCategoryChange(null);
    onPriceRangeChange([0, maxPrice]);
    onBrandsChange(new Set());
  };

  // Apply filters (mobile only) - closes the drawer
  const handleApplyFilters = () => {
    onClose();
  };

  // Filter content component (shared between mobile and desktop)
  const FilterContent = () => (
    <>
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-base font-display font-semibold text-text-primary mb-3">
          Category
        </h3>
        {/* Mobile: 2-Column Grid | Desktop: Vertical Stack */}
        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-2">
          {/* All Products Option */}
          <button
            type="button"
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all duration-200 text-center lg:text-left min-h-[48px] ${
              category === null
                ? 'bg-primary text-white shadow-sm'
                : 'bg-background hover:bg-border text-text-primary'
            }`}
            aria-pressed={category === null}
          >
            All Products
          </button>

          {/* Specific Categories */}
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-3 rounded-lg text-sm font-sans font-medium transition-all duration-200 text-center lg:text-left min-h-[48px] flex items-center gap-2 ${
                category === cat.slug
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background hover:bg-border text-text-primary'
              }`}
              aria-pressed={category === cat.slug}
            >
              {cat.icon_url && (
                <img src={cat.icon_url} alt="" className="w-5 h-5 object-contain" />
              )}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-base font-display font-semibold text-text-primary mb-3">
          Price Range
        </h3>
        <PriceRangeSlider
          min={0}
          max={maxPrice}
          step={5000}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="text-base font-display font-semibold text-text-primary mb-3">
          Brand
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {uniqueBrands.length > 0 ? (
            uniqueBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 p-2 rounded hover:bg-background transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={brands.has(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm font-sans text-text-primary">{brand}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-text-secondary italic">No brands available</p>
          )}
        </div>
      </div>

      {/* Clear All Filters */}
      <button
        type="button"
        onClick={handleClearFilters}
        className="w-full lg:w-auto text-sm font-sans font-medium text-primary hover:text-primary-dark transition-colors py-3 px-4 min-h-[48px] rounded-lg hover:bg-primary/5"
      >
        Clear All Filters
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Bottom Sheet Drawer - Only renders on mobile */}
      <div className="block lg:hidden">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
          aria-hidden={!isOpen}
        />

        {/* Bottom Sheet */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          {/* Grab Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-border rounded-full" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-display font-semibold tracking-tight text-text-primary">
              Filter Products
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-3 -mr-2 hover:bg-background rounded-lg transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Close filters"
            >
              <svg
                className="w-6 h-6 text-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <FilterContent />
          </div>

          {/* Sticky "Show Results" Button */}
          <div className="px-6 py-4 border-t border-border bg-surface sticky bottom-0">
            <button
              type="button"
              onClick={handleApplyFilters}
              className="w-full bg-primary text-white font-display font-semibold py-4 rounded-lg hover:bg-primary-dark transition-colors shadow-md text-base min-h-[48px]"
            >
              Show Results ({filteredCount} {filteredCount !== 1 ? 'products' : 'product'})
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Content - Rendered inline within parent container */}
      <div className="hidden lg:block">
        <div className="sticky top-24 bg-surface border border-border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-display font-semibold tracking-tight text-text-primary mb-6">
            Refine Your Search
          </h2>
          <FilterContent />
        </div>
      </div>
    </>
  );
}
