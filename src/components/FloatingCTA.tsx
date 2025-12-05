'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

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
    <>
      {/* Desktop: Fixed bottom-right button */}
      <Link
        href="/quote"
        className="hidden md:flex fixed bottom-8 right-8 z-50 items-center gap-xs px-lg py-md bg-primary text-surface font-medium hover:bg-primary-dark transition-all hover:scale-105 shadow-xl rounded-lg"
        aria-label="Get your free quote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>Get Your Free Quote</span>
      </Link>

      {/* Mobile: Full-width banner above WhatsApp icon */}
      <div className="md:hidden fixed bottom-20 left-0 right-0 z-50 px-sm">
        <Link
          href="/quote"
          className="flex items-center justify-center gap-xs w-full py-md bg-primary text-surface font-medium hover:bg-primary-dark transition-all shadow-xl rounded-full"
          aria-label="Get your free quote"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-body">Get Your Free Quote</span>
        </Link>
      </div>
    </>
  );
}
