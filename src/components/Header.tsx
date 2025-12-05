'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const CATEGORIES = [
  { value: 'solar-panels', label: 'Solar Panels' },
  { value: 'inverters', label: 'Inverters' },
  { value: 'batteries', label: 'Solar Batteries' },
  { value: 'accessories', label: 'Charge Controllers' },
];

export default function Header() {
  const pathname = usePathname();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary font-medium outline-none focus:outline-none' : 'text-text-primary hover:text-primary outline-none focus:outline-none';
  };

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <nav className="max-w-7xl mx-auto px-md py-md flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          TRXSolar
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
                <div className="bg-surface border border-border shadow-lg rounded min-w-[200px]">
                  <div className="py-sm">
                    <Link
                      href="/products"
                      className="block px-md py-sm text-base text-text-primary hover:bg-background hover:text-primary transition-colors"
                    >
                      All Products
                    </Link>
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.value}
                        href={`/products?category=${category.value}`}
                        className="block px-md py-sm text-base text-text-primary hover:bg-background hover:text-primary transition-colors"
                      >
                        {category.label}
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
        </div>

        {/* Mobile menu button (placeholder for future implementation) */}
        <button
          className="md:hidden w-touch h-touch flex items-center justify-center text-text-primary hover:text-primary"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
