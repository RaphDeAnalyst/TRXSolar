'use client';

import { useEffect, useRef } from 'react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export default function MapModal({ isOpen, onClose, address }: MapModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Get all focusable elements
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the close button
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      // Return focus to the element that had focus before the dialog opened
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Coordinates: 6.460049, 3.190232 (Alaba International Market)
  // Using the standard embed URL format with place ID for better compatibility
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.306854729378!2d3.188016575949339!3d6.460049107566609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8e2e5e8cf1b7%3A0x7e1e9b7a5c3f3c5e!2sAlaba%20International%20Market!5e0!3m2!1sen!2sng!4v1234567890`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-backdrop-fade"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-modal-title"
      aria-describedby="map-modal-description"
    >
      <div
        ref={dialogRef}
        className="relative bg-surface border border-border rounded-lg shadow-2xl w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-7xl animate-modal-enter overflow-hidden"
        role="document"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-border px-md md:px-lg py-md flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2
              id="map-modal-title"
              className="text-h3 md:text-h2 font-display font-semibold text-text-primary"
            >
              Our Location
            </h2>
            <p
              id="map-modal-description"
              className="text-caption md:text-body text-text-secondary truncate"
            >
              {address}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-touch h-touch flex-shrink-0 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors ml-md"
            aria-label="Close map"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map Content */}
        <div className="absolute inset-0 pt-20 md:pt-24">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            title="Interactive map showing VC Solar office location at Alaba International Market"
            className="w-full h-full"
          />
        </div>

        {/* Footer with Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-surface/95 backdrop-blur-sm border-t border-border px-md md:px-lg py-md flex flex-col sm:flex-row gap-sm justify-between items-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=6.460049,3.190232`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-lg py-sm min-h-touch bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-colors rounded shadow-md flex items-center justify-center gap-xs"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Get Directions
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-lg py-sm min-h-touch text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors font-sans font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
