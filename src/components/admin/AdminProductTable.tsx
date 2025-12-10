'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface AdminProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleFeatured: (productId: string, currentStatus: boolean) => void;
}

export default function AdminProductTable({
  products,
  onEdit,
  onDelete,
  onToggleFeatured,
}: AdminProductTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteClick = (productId: string) => {
    setDeleteConfirmId(productId);
  };

  const handleConfirmDelete = (productId: string) => {
    onDelete(productId);
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block border border-border overflow-x-auto rounded">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Image</th>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Name</th>
              <th className="text-left px-md py-sm text-body font-semibold text-text-primary">Brand</th>
              <th className="text-right px-md py-sm text-body font-semibold text-text-primary">Price</th>
              <th className="text-center px-md py-sm text-body font-semibold text-text-primary">Featured</th>
              <th className="text-center px-md py-sm text-body font-semibold text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-background transition-colors">
                <td className="px-md py-sm">
                  <div className="w-16 h-16 relative bg-background rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </td>
                <td className="px-md py-sm text-body text-text-primary font-medium max-w-xs">
                  {product.name}
                </td>
                <td className="px-md py-sm text-body text-text-secondary">{product.brand}</td>
                <td className="px-md py-sm text-body text-right font-mono font-bold text-primary tabular-nums">
                  ₦{product.price.toLocaleString('en-NG')}
                </td>
                <td className="px-md py-sm text-center">
                  {/* Featured Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(product.id, product.featured || false)}
                    className={`relative inline-flex h-6 w-11 min-w-[48px] min-h-[48px] items-center justify-center rounded-full transition-colors ${
                      product.featured ? 'bg-primary' : 'bg-border'
                    }`}
                    aria-label={product.featured ? 'Unmark as featured' : 'Mark as featured'}
                  >
                    <span className="sr-only">Toggle featured status</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        product.featured ? 'translate-x-2' : '-translate-x-2'
                      }`}
                    />
                  </button>
                </td>
                <td className="px-md py-sm">
                  <div className="flex items-center justify-center gap-xs">
                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="w-touch h-touch flex items-center justify-center text-primary hover:bg-background rounded transition-colors"
                      aria-label="Edit product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(product.id)}
                      className="w-touch h-touch flex items-center justify-center text-error hover:bg-background rounded transition-colors"
                      aria-label="Delete product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-md">
        {products.map((product) => (
          <div key={product.id} className="bg-surface border border-border rounded p-md space-y-sm">
            {/* Product Image and Name */}
            <div className="flex gap-md items-start">
              <div className="w-20 h-20 relative bg-background rounded overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-sans font-semibold text-text-primary line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-caption text-text-secondary mt-xs">{product.brand}</p>
              </div>
            </div>

            {/* Product Details - Stacked with Labels */}
            <div className="space-y-xs pt-sm border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-caption font-semibold text-text-secondary">Price:</span>
                <span className="text-base font-mono font-bold text-primary tabular-nums">
                  ₦{product.price.toLocaleString('en-NG')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-caption font-semibold text-text-secondary">Featured Status:</span>
                <button
                  type="button"
                  onClick={() => onToggleFeatured(product.id, product.featured || false)}
                  className={`relative inline-flex h-6 w-11 min-w-[48px] min-h-[48px] items-center justify-center rounded-full transition-colors ${
                    product.featured ? 'bg-primary' : 'bg-border'
                  }`}
                  aria-label={product.featured ? 'Unmark as featured' : 'Mark as featured'}
                >
                  <span className="sr-only">Toggle featured status</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      product.featured ? 'translate-x-2' : '-translate-x-2'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-sm pt-sm border-t border-border">
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="flex-1 px-md py-sm min-h-touch bg-primary text-white font-sans font-semibold rounded hover:bg-primary-dark transition-colors flex items-center justify-center gap-xs"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(product.id)}
                className="flex-1 px-md py-sm min-h-touch bg-error text-white font-sans font-semibold rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-xs"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmId !== null}
        onClose={handleCancelDelete}
        onConfirm={() => handleConfirmDelete(deleteConfirmId!)}
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  );
}
