'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the device is mobile (< 640px)
 * Uses matchMedia for efficient, flicker-free detection
 * Initializes with null to prevent hydration mismatches
 */
export function useIsMobile(breakpoint: number = 640): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Initialize on client only - prevents hydration mismatch
    if (typeof window !== 'undefined') {
      return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
    }
    return false; // SSR default
  });

  useEffect(() => {
    // Create media query for mobile breakpoint
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    // Set initial value (in case SSR default was wrong)
    setIsMobile(mediaQuery.matches);

    // Define listener function
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return isMobile;
}
