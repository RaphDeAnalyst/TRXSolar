'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import productsData from '@/data/products.json';
import AdminProductTable from '@/components/admin/AdminProductTable';
import AdminProductForm from '@/components/admin/AdminProductForm';
import { generateSKU } from '@/lib/admin/skuGenerator';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const ADMIN_PASSWORD = 'solar2024'; // Change this to env variable later

  // Load products on mount
  useEffect(() => {
    if (isAuthenticated) {
      const allProducts: Product[] = [];
      Object.values(productsData).forEach((categoryProducts) => {
        allProducts.push(...(categoryProducts as Product[]));
      });
      setProducts(allProducts);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProducts([]);
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // In a real app, this would make an API call to delete from database
    alert('Product deleted successfully! (Note: This is a demo - changes are not persisted)');
  };

  const handleToggleFeatured = (productId: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, featured: !currentStatus } : p))
    );
    // In a real app, this would make an API call to update in database
  };

  const handleFormSubmit = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
      );
      alert('Product updated successfully! (Note: This is a demo - changes are not persisted)');
    } else {
      // Create new product with auto-generated SKU
      try {
        const sku = generateSKU(productData, products);
        const newProduct: Product = {
          id: sku,
          name: productData.name || '',
          brand: productData.brand || '',
          category: productData.category || 'solar-panels',
          price: productData.price || 0,
          image: productData.image || '',
          description: productData.description || '',
          specs: productData.specs || {},
          featured: productData.featured || false,
          createdAt: new Date().toISOString(),
        };
        setProducts((prev) => [...prev, newProduct]);
        alert(`Product created successfully with SKU: ${sku} (Note: This is a demo - changes are not persisted)`);
      } catch (error) {
        alert(`Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <div className="max-w-md mx-auto px-sm py-2xl flex items-center justify-center min-h-[calc(100vh-200px)]">
          <form onSubmit={handleLogin} className="w-full space-y-md bg-surface p-lg rounded-lg shadow-lg border border-border">
            <div>
              <h1 className="text-h2 md:text-h1 font-display font-bold text-text-primary mb-sm">Admin Login</h1>
              <p className="text-body text-text-secondary">Enter password to manage products</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-body font-medium text-text-primary mb-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-md min-h-touch font-display font-semibold hover:bg-primary-dark transition-colors rounded shadow-md"
            >
              Login
            </button>

            <p className="text-caption text-text-secondary text-center">
              Demo password: <code className="font-mono bg-background px-xs py-xs rounded">solar2024</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Minimal Admin Header - Internal Only, No Public Components */}
      <header className="bg-surface border-b border-border sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-sm py-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
            {/* System Title and User Info */}
            <div className="flex items-center gap-md">
              <div>
                <h1 className="text-h3 md:text-h2 font-display font-bold text-text-primary">VCSolar Admin</h1>
                <p className="text-caption text-text-secondary">Product Management Dashboard</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-md">
              <div className="hidden sm:block text-right">
                <p className="text-caption font-semibold text-text-primary">Admin User</p>
                <p className="text-caption text-text-secondary">admin@vcsolar.com</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="px-md py-sm min-h-touch bg-error text-white font-sans font-semibold hover:opacity-90 transition-opacity rounded shadow-md whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-sm py-lg">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
          <div className="bg-surface border border-border p-md rounded-lg">
            <p className="text-caption text-text-secondary mb-xs">Total Products</p>
            <p className="text-h2 font-display font-bold text-primary">{products.length}</p>
          </div>
          <div className="bg-surface border border-border p-md rounded-lg">
            <p className="text-caption text-text-secondary mb-xs">Featured Products</p>
            <p className="text-h2 font-display font-bold text-success">
              {products.filter((p) => p.featured).length}
            </p>
          </div>
          <div className="bg-surface border border-border p-md rounded-lg">
            <p className="text-caption text-text-secondary mb-xs">Categories</p>
            <p className="text-h2 font-display font-bold text-text-primary">
              {new Set(products.map((p) => p.category)).size}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-surface border border-border p-md rounded-lg mb-lg">
          <div className="flex flex-col md:flex-row gap-md items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <label htmlFor="search" className="sr-only">
                Search products
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, brand, or SKU..."
                className="w-full px-md py-sm border border-border bg-background focus:border-primary focus:outline-none rounded"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <label htmlFor="category-filter" className="sr-only">
                Filter by category
              </label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-auto px-md py-sm border border-border bg-background focus:border-primary focus:outline-none rounded"
              >
                <option value="all">All Categories</option>
                <option value="solar-panels">Solar Panels</option>
                <option value="inverters">Inverters</option>
                <option value="batteries">Batteries</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Add New Button */}
            <button
              type="button"
              onClick={handleAddNew}
              className="w-full md:w-auto px-lg py-sm min-h-touch bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-colors rounded shadow-md flex items-center justify-center gap-xs"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Product
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-md">
          <p className="text-body text-text-secondary">
            Showing <span className="font-semibold text-text-primary">{filteredProducts.length}</span> of{' '}
            <span className="font-semibold text-text-primary">{products.length}</span> products
          </p>
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <AdminProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
          />
        ) : (
          <div className="bg-surface border border-border rounded-lg p-xl text-center">
            <svg
              className="w-16 h-16 mx-auto text-text-secondary mb-md"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-h3 font-display font-medium text-text-primary mb-sm">No products found</h3>
            <p className="text-body text-text-secondary mb-md">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'}
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <button
                type="button"
                onClick={handleAddNew}
                className="px-lg py-sm min-h-touch bg-primary text-white font-display font-semibold hover:bg-primary-dark transition-colors rounded shadow-md"
              >
                Add Your First Product
              </button>
            )}
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-lg bg-warning bg-opacity-10 border border-warning rounded-lg p-md">
          <div className="flex gap-md">
            <svg className="w-6 h-6 text-warning flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h4 className="text-body font-semibold text-warning mb-xs">Demo Mode</h4>
              <p className="text-caption text-text-secondary">
                This is a demonstration admin panel. All changes are stored in memory only and will be lost on page refresh.
                In a production environment, changes would be persisted to a database (e.g., Vercel Postgres).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <AdminProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      )}
    </div>
  );
}
