'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const isMobile = useIsMobile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Freeze the isMobile state when dialog opens to prevent flickering
  const isMobileSnapshot = useRef(isMobile);

  // Update snapshot only when dialog opens
  useEffect(() => {
    if (isOpen) {
      isMobileSnapshot.current = isMobile;
    }
  }, [isOpen, isMobile]);

  // Use the frozen snapshot instead of live isMobile value
  const frozenIsMobile = isOpen ? isMobileSnapshot.current : isMobile;

  // Adaptive button text for mobile
  const mobileCancelText = 'No';
  const mobileConfirmText = 'Yes';

  const displayCancelText = frozenIsMobile ? mobileCancelText : cancelText;
  const displayConfirmText = frozenIsMobile ? mobileConfirmText : confirmText;

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

    // Focus the first element (or confirm button for danger variants)
    if (confirmVariant === 'danger' && focusableElements.length > 1) {
      // For danger actions, focus cancel button first (safer default)
      firstElement?.focus();
    } else {
      // For primary actions, focus confirm button
      lastElement?.focus();
    }

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
  }, [isOpen, confirmVariant]);

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

  // Button classes following design system (48px minimum touch target, font-display)
  const confirmButtonClass =
    confirmVariant === 'danger'
      ? 'flex-1 sm:flex-initial px-6 py-3 min-h-[48px] bg-error text-surface font-display font-semibold hover:bg-error/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'
      : 'flex-1 sm:flex-initial px-6 py-3 min-h-[48px] bg-primary text-surface font-display font-semibold hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';

  // Don't render on server or when closed
  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-backdrop-fade isolate"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={frozenIsMobile ? undefined : "dialog-description"}
    >
      <div
        ref={dialogRef}
        className="bg-surface border border-border rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 md:p-8 animate-modal-enter relative z-10"
        role="alertdialog"
      >
        {/* Title - H3 scale per design system: text-xl on mobile, text-2xl on desktop */}
        <h3
          id="dialog-title"
          className={`font-display font-semibold text-text-primary tracking-normal ${
            frozenIsMobile
              ? 'text-xl mb-6'
              : 'text-xl md:text-2xl mb-3'
          }`}
        >
          {title}
        </h3>

        {/* Message - Body text per design system: text-base, font-sans, leading-normal */}
        {!frozenIsMobile && (
          <p
            id="dialog-description"
            className="text-base font-sans text-text-secondary mb-6 leading-normal"
          >
            {message}
          </p>
        )}

        {/* Button container - stacks vertically on mobile, horizontal on desktop */}
        <div className={`flex gap-3 ${frozenIsMobile ? 'flex-col' : 'flex-col sm:flex-row sm:justify-end'}`}>
          {/* Cancel/No button - 48px touch target, font-display, semibold */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-6 py-3 min-h-[48px] bg-surface border-2 border-primary text-primary font-display font-semibold hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {displayCancelText}
          </button>

          {/* Confirm/Yes button - 48px touch target, font-display, semibold */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={confirmButtonClass}
          >
            {isLoading ? 'Processing...' : displayConfirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
