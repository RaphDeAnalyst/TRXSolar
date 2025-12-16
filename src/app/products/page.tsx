'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
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

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<ProductCategory | null>(
    (searchParams.get('category') as ProductCategory) || null
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  // Fetch products from database on mount (with minimal fields for performance)
  useEffect(() => {
    const fetchDatabaseProducts = async () => {
      try {
        console.log('[Products Page] Fetching products from /api/products...');
        // Request only card fields to minimize payload (PERFORMANCE OPTIMIZATION)
        const response = await fetch('/api/products?fields=card');
        console.log('[Products Page] Response status:', response.status, response.statusText);

        if (response.ok) {
          const data = await response.json();
          console.log('[Products Page] API Response:', data);

          if (data.success && data.products) {
            console.log(`[Products Page] ✅ Loaded ${data.products.length} products from database`);
            if (data._performance) {
              console.log(`[Products Page] 📊 Performance: Query ${data._performance.query_ms}ms, Total ${data._performance.total_ms}ms`);
            }
            setDbProducts(data.products);
          } else {
            console.warn('[Products Page] ⚠️ API returned success:false or no products array');
          }
        } else {
          const errorText = await response.text();
          console.error('[Products Page] ❌ API request failed:', response.status, errorText);
        }
      } catch (error) {
        console.error('[Products Page] ❌ Failed to load database products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchDatabaseProducts();
  }, []);

  // Get all products - merge JSON and database products
  const allProducts = useMemo(() => {
    const products: Product[] = [];

    // Add products from JSON file
    Object.values(productsData).forEach((categoryProducts) => {
      products.push(...(categoryProducts as Product[]));
    });

    // Add products from database
    products.push(...dbProducts);

    return products;
  }, [dbProducts]);

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

  // Calculate max price based on current category (dynamically adjusts)
  const categoryMaxPrice = useMemo(() => {
    let productsToConsider = allProducts;

    // If category is selected, only consider products in that category
    if (category) {
      productsToConsider = allProducts.filter((p) => p.category === category);
    }

    // Get the highest price
    if (productsToConsider.length === 0) return 10000; // Default if no products
    const categoryMax = Math.max(...productsToConsider.map((p) => p.price));

    // Round up to nice round number
    return roundUpPrice(categoryMax);
  }, [allProducts, category]);

  // Reset price range and brand selections when category changes
  useEffect(() => {
    setPriceRange([0, categoryMaxPrice]);
    // Clear brand selections when switching categories to avoid showing irrelevant filters
    setBrands(new Set());
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [category, categoryMaxPrice]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, brands]);

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

  // Paginate filtered products
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, PRODUCTS_PER_PAGE]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleApplyFilters = () => {
    setMobileFilterOpen(false);
  };

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto px-xs py-lg">
        {/* Contextual Header Banner */}
        <div className="mb-md md:mb-lg">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-text-primary mb-xs">
            All Solar Components
          </h1>
          <p className="text-body text-text-secondary max-w-3xl">
            Find high-efficiency solar panels, inverters, and batteries for your residential or commercial project.
          </p>
          {isLoadingProducts && (
            <p className="text-caption text-primary mt-xs">Loading products from database...</p>
          )}
        </div>

        {/* Mobile Filter Button - Always visible on mobile */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="md:hidden w-full max-w-md mx-auto flex items-center justify-center gap-xs px-md py-sm bg-primary text-white hover:bg-primary-dark transition-colors rounded shadow-md mb-md font-sans font-semibold"
          aria-label="Open filters"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Filter Products</span>
        </button>

        {/* Mobile Filter Drawer - Full screen modal */}
        {mobileFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border px-md py-sm flex items-center justify-between shadow-sm">
              <h2 className="text-lg font-display font-semibold text-text-primary">Refine Your Search</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-background rounded-full transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-md space-y-lg pb-32">
              {/* Category Filter */}
              <div>
                <h3 className="text-base font-sans font-semibold text-text-primary mb-sm">Category</h3>
                <div className="space-y-sm">
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className={`block w-full text-left text-base font-sans px-3 py-2 rounded transition-colors ${
                      category === null ? 'bg-primary text-white font-semibold' : 'text-text-primary hover:bg-background'
                    }`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`block w-full text-left text-base font-sans px-3 py-2 rounded transition-colors ${
                        category === cat.value ? 'bg-primary text-white font-semibold' : 'text-text-primary hover:bg-background'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-md border-t border-border">
                <h3 className="text-base font-sans font-semibold text-text-primary mb-sm">Price Range</h3>
                <div className="space-y-md">
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full h-2"
                    aria-label="Minimum price"
                  />
                  <input
                    type="range"
                    min="0"
                    max={categoryMaxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2"
                    aria-label="Maximum price"
                  />
                  <div className="text-sm font-mono font-bold text-text-primary">
                    ₦{priceRange[0].toLocaleString('en-NG')} - ₦{priceRange[1].toLocaleString('en-NG')}
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              {uniqueBrands.length > 0 && (
                <div className="pt-md border-t border-border">
                  <h3 className="text-base font-sans font-semibold text-text-primary mb-sm">Brand</h3>
                  <div className="space-y-sm">
                    {uniqueBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-sm cursor-pointer py-xs">
                        <input
                          type="checkbox"
                          checked={brands.has(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-5 h-5 min-w-[20px] min-h-[20px]"
                        />
                        <span className="text-base font-sans text-text-primary">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full text-base font-sans text-primary hover:text-primary-dark font-medium pt-md border-t border-border text-center"
              >
                Clear All Filters
              </button>
            </div>

            {/* Sticky Apply Filters CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-md shadow-lg">
              <div className="max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="w-full bg-primary text-white font-display font-semibold py-4 rounded-lg hover:bg-primary-dark transition-colors shadow-md text-base"
                >
                  Apply Filters ({filteredProducts.length} {filteredProducts.length !== 1 ? 'products' : 'product'})
                </button>
                {totalPages > 1 && (
                  <p className="text-center text-xs text-text-secondary mt-sm">
                    Results shown across {totalPages} pages
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Floating Filter Toggle Button (when collapsed) - Desktop only */}
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
            <span className="text-body font-medium">Refine Search</span>
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
                <span className="text-body font-semibold text-text-primary">Refine Your Search</span>
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
                <h3 className="text-body font-semibold text-text-primary mb-sm">Category</h3>
                <div className="space-y-sm">
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className={`block w-full text-left text-caption px-3 py-2 rounded transition-colors ${
                      category === null ? 'bg-primary text-white font-semibold' : 'text-text-primary hover:bg-background'
                    }`}
                  >
                    All Products
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`block w-full text-left text-caption px-3 py-2 rounded transition-colors ${
                        category === cat.value ? 'bg-primary text-white font-semibold' : 'text-text-primary hover:bg-background'
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
            <div className="mb-lg flex flex-wrap gap-sm items-center justify-between">
              <div className="flex flex-wrap gap-sm items-center">
                <span className="text-caption text-text-secondary">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {totalPages > 1 && (
                    <span className="ml-xs">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
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
            </div>

            {/* Product Grid */}
            <ProductGrid products={paginatedProducts} isLoading={isLoadingProducts} />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />

            {/* CTA Section */}
            <div className="mt-2xl bg-primary/10 border border-primary/20 rounded-lg p-xl text-center">
              <h3 className="text-xl md:text-2xl text-text-primary font-medium mb-sm">Need Help Choosing?</h3>
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

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading products...</p>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
