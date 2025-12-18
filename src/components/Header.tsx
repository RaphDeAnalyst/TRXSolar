'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import WishlistIcon from './WishlistIcon';
import { Category } from '@/lib/types';

export default function Header() {
  const pathname = usePathname();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsExpanded, setMobileProductsExpanded] = useState(false);
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

  const isActive = (path: string) => {
    return pathname === path
      ? 'text-primary-light font-medium outline-none focus:outline-none'
      : 'text-gray-200 hover:text-primary-light outline-none focus:outline-none';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 shadow-md h-[var(--header-height)]">
      <nav className="max-w-7xl mx-auto px-md h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo.png"
            alt="VC Solar and Electricals - Quality Solar Energy Solutions"
            height={40}
            width={160}
            priority
            style={{ width: 'auto', height: '40px' }}
            unoptimized
          />
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-xl items-center">
          <Link href="/" className={`text-lg ${isActive('/')}`}>
            Home
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
          >
            <Link
              href="/products"
              className={`text-lg flex items-center gap-xs ${isActive('/products')}`}
            >
              Products
              <svg
                className={`w-5 h-5 transition-transform ${showProductsDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {showProductsDropdown && (
              <div className="absolute top-full left-0 pt-2 -mt-2">
                <div className="bg-white border border-gray-200 shadow-lg rounded min-w-[200px]">
                  <div className="py-sm">
                    <Link
                      href="/products"
                      className="block px-md py-sm text-base text-text-primary hover:bg-background hover:text-primary transition-colors"
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        className="flex items-center gap-2 px-md py-sm text-base text-text-primary hover:bg-background hover:text-primary transition-colors"
                      >
                        {category.icon_url && (
                          <img src={category.icon_url} alt="" className="w-4 h-4 object-contain" />
                        )}
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href="/about" className={`text-lg ${isActive('/about')}`}>
            About
          </Link>
          <Link href="/contact" className={`text-lg ${isActive('/contact')}`}>
            Contact
          </Link>

          {/* Wishlist Icon */}
          <WishlistIcon />

          {/* Get Quote CTA Button */}
          <Link
            href="/quote"
            className="px-lg py-sm bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-colors rounded shadow-md"
          >
            Get Your Free Quote
          </Link>
        </div>

        {/* Mobile: Wishlist, Quote Icon and Hamburger Menu */}
        <div className="md:hidden flex items-center gap-sm">
          {/* Wishlist Icon */}
          <WishlistIcon />

          {/* Quote Icon */}
          <Link
            href="/quote"
            className="w-touch h-touch flex items-center justify-center text-primary-light hover:text-primary transition-colors"
            aria-label="Get a quote"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="w-touch h-touch flex items-center justify-center text-gray-200 hover:text-primary-light"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Slide-out Menu - Full screen overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-gray-900">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-md py-md border-b border-gray-700">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src="/Logo.png"
                alt="VC Solar and Electricals - Quality Solar Energy Solutions"
                height={40}
                width={160}
                style={{ width: 'auto', height: '40px' }}
                unoptimized
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-touch h-touch flex items-center justify-center text-gray-200 hover:text-white"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col p-md space-y-sm">
            {/* Primary CTA: Get Your Free Quote */}
            <Link
              href="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full px-lg py-md bg-primary text-white font-display font-bold text-center hover:bg-primary-dark transition-colors rounded shadow-lg text-lg"
            >
              Get Your Free Quote
            </Link>

            {/* Home Link */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-sans py-sm px-md rounded transition-colors ${
                pathname === '/' ? 'text-primary-light font-semibold bg-primary/20' : 'text-gray-200'
              }`}
            >
              Home
            </Link>

            {/* Products Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileProductsExpanded(!mobileProductsExpanded)}
                className="w-full flex items-center justify-between text-lg font-sans py-sm px-md rounded transition-colors text-gray-200"
              >
                <span className={pathname?.startsWith('/products') ? 'text-primary-light font-semibold' : ''}>
                  Products
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${mobileProductsExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Products Subcategories - Collapsible */}
              {mobileProductsExpanded && (
                <div className="ml-md mt-xs space-y-xs">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-sans py-sm px-md rounded text-gray-400 hover:text-primary-light hover:bg-gray-800 transition-colors"
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-base font-sans py-sm px-md rounded text-gray-400 hover:text-primary-light hover:bg-gray-800 transition-colors"
                    >
                      {category.icon_url && (
                        <img src={category.icon_url} alt="" className="w-4 h-4 object-contain" />
                      )}
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About Link */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-sans py-sm px-md rounded transition-colors ${
                pathname === '/about' ? 'text-primary-light font-semibold bg-primary/20' : 'text-gray-200'
              }`}
            >
              About
            </Link>

            {/* Contact Link */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-sans py-sm px-md rounded transition-colors ${
                pathname === '/contact' ? 'text-primary-light font-semibold bg-primary/20' : 'text-gray-200'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
