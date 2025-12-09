'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  productName: string;
  images: string[];
}

export default function ProductImageGallery({ productName, images }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Keyboard navigation for gallery
  useEffect(() => {
    if (isLightboxOpen) return; // Don't handle gallery navigation when lightbox is open

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isLightboxOpen]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLightboxOpen]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Lightbox component
  const Lightbox = () => (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={closeLightbox}
    >
      {/* Close button */}
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close lightbox"
      >
        <svg
          className="w-6 h-6 text-white"
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

      {/* Image counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
        {lightboxIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          className="absolute left-4 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Main image */}
      <div
        className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[lightboxIndex]}
          alt={`${productName} - View ${lightboxIndex + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="absolute right-4 z-50 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Thumbnail strip at bottom for desktop */}
      {images.length > 1 && (
        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-50 gap-2 max-w-4xl overflow-x-auto px-4">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(idx);
              }}
              className={`flex-shrink-0 w-16 h-16 relative rounded ${
                idx === lightboxIndex
                  ? 'ring-2 ring-primary'
                  : 'opacity-60 hover:opacity-100'
              } transition-opacity`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}

      {/* Swipe indicator for mobile */}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-50 text-white/60 text-xs">
        Swipe or use arrows to navigate
      </div>
    </div>
  );

  // If only one image, show static display with lightbox
  if (images.length <= 1) {
    return (
      <>
        <button
          onClick={() => openLightbox(0)}
          className="bg-background aspect-square relative w-full cursor-zoom-in hover:opacity-90 transition-opacity"
          aria-label="Open image in full screen"
        >
          <Image
            src={images[0]}
            alt={productName}
            fill
            className="object-cover"
            priority
          />
        </button>

        {/* Lightbox Modal */}
        {isLightboxOpen && <Lightbox />}
      </>
    );
  }

  // Interactive gallery for 2+ images
  return (
    <>
      <div>
        {/* Main Image Viewer - Clickable for lightbox */}
        <button
          onClick={() => openLightbox(activeIndex)}
          className="bg-background aspect-square relative mb-md w-full cursor-zoom-in hover:opacity-90 transition-opacity"
          aria-label="Open image in full screen"
        >
          <Image
            src={images[activeIndex]}
            alt={`${productName} - View ${activeIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
            <span>Click to enlarge</span>
          </div>
        </button>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-4 gap-md">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`bg-background aspect-square relative cursor-pointer transition-all ${
                idx === activeIndex
                  ? 'ring-2 ring-primary'
                  : 'hover:opacity-75'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && <Lightbox />}
    </>
  );
}
