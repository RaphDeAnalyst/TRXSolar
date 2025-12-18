'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddCategoryModal from './AddCategoryModal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useToast } from '@/components/contexts/ToastContext';

interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  category_code: string | null;
  display_order: number;
  product_count?: number;
}

interface CategoryManagementTabProps {
  adminPassword: string;
}

// Sortable Category Card Component
function SortableCategoryCard({ category, onEdit, onDelete }: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface border border-border rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="min-h-[48px] min-w-[48px] flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
          aria-label="Drag to reorder"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Category Icon */}
        {category.icon_url && (
          <div className="w-12 h-12 flex items-center justify-center border border-border rounded-lg p-2 flex-shrink-0">
            <img
              src={category.icon_url}
              alt={`${category.name} icon`}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Category Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-semibold text-text-primary text-lg truncate">
                {category.name}
              </h4>
              <p className="text-text-secondary text-sm font-mono">
                /{category.slug}
              </p>
            </div>

            {/* Product Count Badge */}
            <span className="flex-shrink-0 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono tabular-nums font-bold">
              {category.product_count || 0} {category.product_count === 1 ? 'product' : 'products'}
            </span>
          </div>

          {category.description && (
            <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
              {category.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={onEdit}
              className="px-4 py-2 min-h-[48px] bg-primary/10 text-primary font-display font-semibold hover:bg-primary/20 rounded-lg transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 min-h-[48px] bg-error/10 text-error font-display font-semibold hover:bg-error/20 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryManagementTab({ adminPassword }: CategoryManagementTabProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental drags)
      },
    })
  );

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${adminPassword}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      } else {
        showToast({ type: 'error', message: 'Failed to load categories' });
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      showToast({ type: 'error', message: 'Failed to load categories' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex(c => c.id === active.id);
    const newIndex = categories.findIndex(c => c.id === over.id);

    // Optimistic update
    const reorderedCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(reorderedCategories);

    try {
      // Prepare order payload
      const order = reorderedCategories.map((cat, idx) => ({
        slug: cat.slug,
        display_order: idx + 1
      }));

      const response = await fetch('/api/admin/categories/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify({ order })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Reorder failed');
      }

      showToast({ type: 'success', message: 'Categories reordered successfully' });
    } catch (error) {
      console.error('Error reordering categories:', error);
      // Rollback optimistic update
      setCategories(categories);
      showToast({ type: 'error', message: 'Failed to reorder categories' });
    }
  };

  const handleCreateCategory = async (categoryData: Omit<Category, 'id' | 'product_count' | 'display_order'>) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();

      if (data.success) {
        // Refresh categories list
        await loadCategories();
        showToast({ type: 'success', message: 'Category created successfully' });
        setShowAddModal(false);
      } else {
        // Handle duplicate slug error
        if (data.suggestion) {
          showToast({
            type: 'error',
            message: `Slug already exists. Try: ${data.suggestion}`
          });
        } else {
          showToast({ type: 'error', message: data.error || 'Failed to create category' });
        }
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const handleUpdateCategory = async (categoryData: Omit<Category, 'id' | 'product_count' | 'display_order'>) => {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(categoryData)
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
        showToast({ type: 'success', message: 'Category updated successfully' });
        setEditingCategory(null);
        setShowAddModal(false);
      } else {
        showToast({ type: 'error', message: data.error || 'Failed to update category' });
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/categories/${deletingCategory.slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPassword}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
        showToast({ type: 'success', message: 'Category deleted successfully' });
        setDeletingCategory(null);
      } else {
        // Deletion blocked due to products
        if (data.product_count) {
          showToast({
            type: 'error',
            message: `Cannot delete: ${data.product_count} product${data.product_count === 1 ? '' : 's'} use this category`
          });
        } else {
          showToast({ type: 'error', message: data.error || 'Failed to delete category' });
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast({ type: 'error', message: 'Failed to delete category' });
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading skeleton */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-background rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-background rounded w-1/3"></div>
                <div className="h-4 bg-background rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-background rounded w-20"></div>
                  <div className="h-10 bg-background rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-2xl md:text-3xl text-text-primary tracking-tight mb-2">
            Categories
          </h2>
          <p className="text-text-secondary text-base">
            Manage product categories. Drag to reorder.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 min-h-[48px] bg-primary text-surface font-display font-semibold hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
        >
          + Add Category
        </button>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-xl text-text-primary mb-2">
              No categories yet
            </h3>
            <p className="text-text-secondary mb-6">
              Create your first category to start organizing products
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 min-h-[48px] bg-primary text-surface font-display font-semibold hover:bg-primary-dark rounded-lg transition-colors shadow-sm"
            >
              Add First Category
            </button>
          </div>
        </div>
      ) : (
        /* Category List with Drag and Drop */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {categories.map(category => (
                <SortableCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => openEditModal(category)}
                  onDelete={() => setDeletingCategory(category)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add/Edit Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={closeModal}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        editingCategory={editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category?"
        message={
          deletingCategory?.product_count
            ? `This category has ${deletingCategory.product_count} product${deletingCategory.product_count === 1 ? '' : 's'}. Deletion is blocked. Please reassign products first.`
            : `Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`
        }
        confirmText={deletingCategory?.product_count ? 'OK' : 'Delete'}
        confirmVariant={deletingCategory?.product_count ? 'primary' : 'danger'}
        isLoading={isDeleting}
      />
    </div>
  );
}
