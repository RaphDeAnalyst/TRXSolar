'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Category } from '@/lib/types';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id' | 'product_count' | 'display_order'>) => Promise<void>;
  editingCategory?: Category | null;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
}: AddCategoryModalProps) {
  const isMobile = useIsMobile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_url: '',
    category_code: ''
  });

  // Mount check for SSR safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Freeze the isMobile state when dialog opens to prevent flickering
  const isMobileSnapshot = useRef(isMobile);

  useEffect(() => {
    if (isOpen) {
      isMobileSnapshot.current = isMobile;
    }
  }, [isOpen, isMobile]);

  const frozenIsMobile = isOpen ? isMobileSnapshot.current : isMobile;

  // Initialize form data when editing
  useEffect(() => {
    if (isOpen && editingCategory) {
      setFormData({
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description || '',
        icon_url: editingCategory.icon_url || '',
        category_code: editingCategory.category_code || ''
      });
    } else if (isOpen) {
      // Reset form when opening in create mode
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon_url: '',
        category_code: ''
      });
      setErrors({});
    }
  }, [isOpen, editingCategory]);

  // Auto-generate slug from name (only for new categories)
  useEffect(() => {
    if (formData.name && !editingCategory) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, editingCategory]);

  // Auto-suggest category code from name (only for new categories if code is empty)
  useEffect(() => {
    if (formData.name && !editingCategory && !formData.category_code) {
      const words = formData.name.split(/\s+/).filter(w => w.length > 0);
      let suggestedCode = '';

      if (words.length === 1) {
        // Single word: take first 2-3 chars
        suggestedCode = words[0].substring(0, 3).toUpperCase();
      } else if (words.length === 2) {
        // Two words: take first 2 chars of each
        suggestedCode = (words[0].substring(0, 2) + words[1].substring(0, 2)).toUpperCase();
      } else {
        // Multiple words: take first char of first 3-4 words
        suggestedCode = words.slice(0, Math.min(4, words.length)).map(w => w[0]).join('').toUpperCase();
      }

      // Clean non-alphabetic characters
      suggestedCode = suggestedCode.replace(/[^A-Z]/g, '');

      // Limit to 4 chars
      if (suggestedCode.length > 4) {
        suggestedCode = suggestedCode.substring(0, 4);
      }

      setFormData(prev => ({ ...prev, category_code: suggestedCode }));
    }
  }, [formData.name, editingCategory, formData.category_code]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first input (name field)
    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Category slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        slug: formData.slug,
        name: formData.name,
        description: formData.description || null,
        icon_url: formData.icon_url || null,
        category_code: formData.category_code || null
      });

      // Success - close modal
      onClose();
    } catch (error) {
      console.error('Error submitting category:', error);
      setErrors({ submit: 'Failed to save category. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-backdrop-fade isolate"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={dialogRef}
        className="bg-surface border border-border rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6 md:p-8 animate-modal-enter relative z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            id="modal-title"
            className="font-display font-semibold text-text-primary text-xl md:text-2xl tracking-normal"
          >
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-sans font-medium text-text-primary mb-2">
              Category Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-border bg-surface text-text-primary focus:border-primary focus:outline-none rounded-lg min-h-[48px]"
              placeholder="e.g., Solar Panels, Inverters"
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-sans font-medium text-text-primary mb-2">
              Slug <span className="text-error">*</span>
              {editingCategory && (
                <span className="ml-2 text-xs text-text-secondary">(Cannot be changed)</span>
              )}
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              disabled={isLoading || !!editingCategory}
              className="w-full px-4 py-3 border border-border bg-surface text-text-primary focus:border-primary focus:outline-none rounded-lg min-h-[48px] disabled:bg-background disabled:text-text-secondary disabled:cursor-not-allowed"
              placeholder="e.g., solar-panels, inverters"
            />
            <p className="text-text-secondary text-xs mt-1">
              {editingCategory
                ? "Slugs are immutable to preserve product category references and SEO"
                : "Auto-generated from name. Lowercase letters, numbers, and hyphens only."}
            </p>
            {errors.slug && (
              <p className="text-error text-sm mt-1">{errors.slug}</p>
            )}
          </div>

          {/* Category Code */}
          <div>
            <label htmlFor="category_code" className="block text-sm font-sans font-medium text-text-primary mb-2">
              Category Code (Optional)
            </label>
            <input
              type="text"
              id="category_code"
              name="category_code"
              value={formData.category_code}
              onChange={handleChange}
              disabled={isLoading}
              maxLength={4}
              className="w-full px-4 py-3 border border-border bg-surface text-text-primary focus:border-primary focus:outline-none rounded-lg min-h-[48px] font-mono uppercase"
              placeholder="SP, INV, FL"
            />
            <p className="text-text-secondary text-xs mt-1">
              2-4 uppercase letters used in product SKU (e.g., WAK-<strong>FL</strong>-30-001). Auto-suggested from name, or leave blank for automatic generation.
            </p>
            {errors.category_code && (
              <p className="text-error text-sm mt-1">{errors.category_code}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-sans font-medium text-text-primary mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              className="w-full px-4 py-3 border border-border bg-surface text-text-primary focus:border-primary focus:outline-none rounded-lg resize-none"
              placeholder="Brief description of this category..."
            />
          </div>

          {/* Icon URL */}
          <div>
            <label htmlFor="icon_url" className="block text-sm font-sans font-medium text-text-primary mb-2">
              Icon URL (Optional)
            </label>
            <input
              type="url"
              id="icon_url"
              name="icon_url"
              value={formData.icon_url}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-border bg-surface text-text-primary focus:border-primary focus:outline-none rounded-lg min-h-[48px]"
              placeholder="https://example.com/icon.svg"
            />
            {formData.icon_url && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={formData.icon_url}
                  alt="Icon preview"
                  className="w-8 h-8 object-contain border border-border rounded p-1"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.alt = 'Invalid icon URL';
                  }}
                />
                <span className="text-xs text-text-secondary">Preview</span>
              </div>
            )}
            <p className="text-text-secondary text-xs mt-1">
              Provide a direct URL to an icon image (SVG, PNG). Future updates will include upload and library options.
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-error text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Button container */}
          <div className={`flex gap-3 pt-4 ${frozenIsMobile ? 'flex-col' : 'flex-col sm:flex-row sm:justify-end'}`}>
            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-6 py-3 min-h-[48px] bg-surface border-2 border-border text-text-primary font-display font-semibold hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 sm:flex-initial px-6 py-3 min-h-[48px] bg-primary text-surface font-display font-semibold hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
