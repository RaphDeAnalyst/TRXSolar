'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past the hero section (viewport height)
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      setIsVisible(scrollPosition > viewportHeight);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-24 z-40 flex items-center gap-2"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Desktop: Pop-out button with expand animation */}
      <Link
        href="/quote"
        className={`hidden md:flex items-center gap-xs bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-all duration-200 shadow-xl ${
          isExpanded
            ? 'px-lg py-sm rounded-full'
            : 'w-12 h-12 justify-center rounded-full'
        }`}
        aria-label="Get your free quote"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span
          className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          Get Your Free Quote
        </span>
      </Link>

      {/* Mobile: Compact pill-shaped button */}
      <Link
        href="/quote"
        className="md:hidden flex items-center gap-1 px-3 py-2 bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-all shadow-xl rounded-full min-h-[48px] min-w-[48px]"
        aria-label="Get your free quote"
        title="Get Your Free Quote"
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-xs font-semibold">Quote</span>
      </Link>
    </div>
  );
}
