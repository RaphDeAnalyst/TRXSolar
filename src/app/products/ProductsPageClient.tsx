'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import Pagination from '@/components/Pagination';
import ProductFilterPanel from '@/components/ProductFilterPanel';
import productsData from '@/data/products.json';
import { Product, ProductCategory, Category } from '@/lib/types';

interface ProductsPageClientProps {
  initialProducts: Product[];
  initialCategory: ProductCategory | null;
}

export default function ProductsPageClient({
  initialProducts,
  initialCategory,
}: ProductsPageClientProps) {
  // Initialize state with server-provided data
  const [category, setCategory] = useState<ProductCategory | null>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Desktop filter collapse state with localStorage persistence
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('desktop-filter-open');
      return saved !== null ? saved === 'true' : true; // Default to open
    }
    return true;
  });

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

  // Persist desktop filter state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('desktop-filter-open', isDesktopFilterOpen.toString());
    }
  }, [isDesktopFilterOpen]);

  // Toggle desktop filter
  const toggleDesktopFilter = () => {
    setIsDesktopFilterOpen((prev) => !prev);
  };

  // KEY CHANGE: Use server data directly (no need for state since data doesn't change)
  const dbProducts = initialProducts;
  const [isLoadingProducts] = useState(false); // Already loaded

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  // Merge JSON and database products
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

  // Calculate the actual max price from all products (rounded up)
  const actualMaxPrice = useMemo(() => {
    if (allProducts.length === 0) return 1000000;

    let productsToConsider = allProducts;
    if (category) {
      productsToConsider = allProducts.filter((p) => p.category === category);
    }

    const prices = productsToConsider.map((p) => p.price);
    const max = Math.max(...prices);

    // Round up to user-friendly value
    if (max <= 1000) return Math.ceil(max / 100) * 100;
    if (max <= 10000) return Math.ceil(max / 1000) * 1000;
    if (max <= 100000) return Math.ceil(max / 10000) * 10000;
    return Math.ceil(max / 100000) * 100000;
  }, [allProducts, category]);

  // Update price range max when products load or category changes
  useEffect(() => {
    // Only update if the current max is the initial placeholder value
    // OR if the actual max is higher than current max (prevents filtering)
    if (priceRange[1] === 1000000 || actualMaxPrice > priceRange[1]) {
      setPriceRange((prev) => [prev[0], actualMaxPrice]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualMaxPrice]);

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

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Contextual Header Banner */}
        <div className="mb-10">
          {/* Meta-Data: Product Count */}
          <span className="text-xs font-sans font-semibold text-text-secondary uppercase tracking-widest mb-2 block">
            {isLoadingProducts ? (
              'Loading products...'
            ) : (
              `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
            )}
          </span>

          {/* H1: Fluid Typography */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-tight text-text-primary mb-3">
            All Solar Components
          </h1>

          {/* Description: Refined Typography */}
          <p className="text-sm md:text-base text-text-secondary max-w-2xl leading-relaxed">
            Find high-efficiency solar panels, inverters, and batteries for your residential or commercial project.
          </p>
        </div>

        {/* Mobile Filter Trigger Button - Full-width button below title */}
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors rounded-lg shadow-sm mb-8 font-display font-semibold text-base min-h-[48px]"
          aria-label="Open filters"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span>Refine Search</span>
        </button>

        {/* Floating Vertical Tab - Shows when filters are closed (Desktop only) */}
        {!isDesktopFilterOpen && (
          <button
            type="button"
            onClick={toggleDesktopFilter}
            className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-20 flex-col items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark transition-all duration-300 py-6 px-3 rounded-r-lg shadow-xl"
            aria-label="Show filters"
            title="Show filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
              Filters
            </span>
          </button>
        )}

        {/* Adaptive Filter Panel Component - Fluid Layout */}
        <div className="flex flex-col lg:flex-row gap-8 transition-all duration-300">
          {/* Desktop Sidebar - Only takes space when open */}
          {isDesktopFilterOpen && (
            <div className="hidden lg:block w-64 flex-shrink-0 animate-slideInLeft">
              {/* Close Button inside sidebar */}
              <button
                type="button"
                onClick={toggleDesktopFilter}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-all duration-300 rounded-lg shadow-sm font-sans font-semibold text-sm mb-6"
                aria-label="Hide filters"
                aria-expanded={true}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Hide Filters</span>
              </button>

              {/* Filter Panel Content */}
              <ProductFilterPanel
                category={category}
                priceRange={priceRange}
                brands={brands}
                onCategoryChange={setCategory}
                onPriceRangeChange={setPriceRange}
                onBrandsChange={setBrands}
                allProducts={allProducts}
                uniqueBrands={uniqueBrands}
                isOpen={mobileFilterOpen}
                onClose={() => setMobileFilterOpen(false)}
                filteredCount={filteredProducts.length}
              />
            </div>
          )}

          {/* Mobile Filter Panel - Only shows on mobile */}
          <div className="lg:hidden">
            <ProductFilterPanel
              category={category}
              priceRange={priceRange}
              brands={brands}
              onCategoryChange={setCategory}
              onPriceRangeChange={setPriceRange}
              onBrandsChange={setBrands}
              allProducts={allProducts}
              uniqueBrands={uniqueBrands}
              isOpen={mobileFilterOpen}
              onClose={() => setMobileFilterOpen(false)}
              filteredCount={filteredProducts.length}
            />
          </div>

          {/* Products Section - Fluid width that expands when filters close */}
          <div className="flex-1 min-w-0 transition-all duration-300">
            {/* Filter Summary */}
            <div className="mb-6 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex flex-wrap gap-2 items-center">
                {totalPages > 1 && (
                  <span className="text-xs font-sans text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </span>
                )}

                {/* Active Filters - Mobile */}
                <div className="flex flex-wrap gap-2 md:hidden">
                  {category && (
                    <button
                      type="button"
                      onClick={() => setCategory(null)}
                      className="text-xs bg-background px-3 py-1.5 rounded-md flex items-center gap-2 hover:bg-border transition-colors min-h-[32px]"
                    >
                      {categories.find((c) => c.slug === category)?.name || category}
                      <span aria-hidden="true">✕</span>
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
            <div className="mt-12 md:mt-16 bg-primary/10 border border-primary/20 rounded-lg p-6 md:p-8 text-center">
              <h3 className="text-xl md:text-2xl font-display font-semibold tracking-tight text-text-primary mb-3">
                Need Help Choosing?
              </h3>
              <p className="text-sm md:text-base text-text-secondary mb-6 max-w-2xl mx-auto leading-relaxed">
                Our solar experts can help you find the perfect system for your needs and provide a personalized quote.
              </p>
              <Link
                href="/quote"
                className="inline-block bg-primary text-surface px-8 py-3 min-h-[48px] font-display font-semibold hover:bg-primary-dark transition-colors shadow-md rounded-lg"
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
