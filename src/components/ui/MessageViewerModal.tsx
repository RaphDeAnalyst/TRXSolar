'use client';

import { useEffect, useRef } from 'react';
import { Contact } from '@/types';

interface MessageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onUpdateStatus?: (contactId: number, status: string) => void;
}

export default function MessageViewerModal({
  isOpen,
  onClose,
  contact,
  onUpdateStatus,
}: MessageViewerModalProps) {
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

  if (!isOpen || !contact) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-sm md:p-md animate-backdrop-fade"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={dialogRef}
        className="bg-surface border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-enter"
        role="document"
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border p-md md:p-lg">
          <div className="flex items-start justify-between gap-md mb-md">
            <div className="flex-1 min-w-0">
              <h2
                id="modal-title"
                className="text-h3 md:text-h2 font-display font-semibold text-text-primary mb-xs"
              >
                Inquiry from {contact.name}
              </h2>
              <div className="flex flex-wrap items-center gap-sm">
                <span className="text-caption text-text-secondary">
                  {formatDate(contact.created_at)}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-touch h-touch flex-shrink-0 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors"
              aria-label="Close modal"
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

          {/* Status Management */}
          {onUpdateStatus && (
            <div className="flex items-center gap-sm">
              <label htmlFor="status-select" className="text-body font-sans font-semibold text-text-secondary uppercase tracking-wider">
                Status:
              </label>
              <select
                id="status-select"
                value={contact.status}
                onChange={(e) => onUpdateStatus(contact.id, e.target.value)}
                className="px-md py-sm border border-border bg-background text-body rounded focus:border-primary focus:outline-none transition-colors"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        {/* Content */}
        <div id="modal-description" className="p-md md:p-lg space-y-lg">
          {/* Contact Information Section */}
          <div className="space-y-md">
            <h3 className="text-body font-sans font-semibold text-text-primary uppercase tracking-wider">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {/* Name */}
              <div>
                <p className="text-caption font-sans font-semibold text-text-secondary uppercase tracking-wider mb-xs">
                  Name
                </p>
                <p className="text-base font-sans text-text-primary">
                  {contact.name}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-caption font-sans font-semibold text-text-secondary uppercase tracking-wider mb-xs">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-base font-sans text-primary hover:underline break-all"
                >
                  {contact.email}
                </a>
              </div>

              {/* Phone (if available) */}
              {contact.phone && (
                <div>
                  <p className="text-caption font-sans font-semibold text-text-secondary uppercase tracking-wider mb-xs">
                    Phone
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-base font-sans text-primary hover:underline"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="text-caption font-sans font-semibold text-text-secondary uppercase tracking-wider mb-xs">
                  Received
                </p>
                <p className="text-base font-sans text-text-primary">
                  {formatDate(contact.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div className="space-y-md">
            <h3 className="text-body font-sans font-semibold text-text-primary uppercase tracking-wider">
              Message
            </h3>
            <div className="bg-background border border-border rounded p-md">
              <p className="text-base font-sans text-text-primary leading-relaxed whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface border-t border-border p-md md:p-lg flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-lg py-sm min-h-touch bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-colors rounded shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
