'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import productsData from '@/data/products.json';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

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
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <div className="max-w-md mx-auto px-sm py-2xl flex items-center justify-center min-h-[calc(100vh-200px)]">
          <form onSubmit={handleLogin} className="w-full space-y-md">
            <div>
              <h1 className="text-h1 text-text-primary font-bold mb-md">Admin Login</h1>
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
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-surface py-md min-h-touch font-medium hover:bg-primary-dark transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-sm py-lg">
        <div className="flex items-center justify-between mb-lg">
          <h1 className="text-h1 text-text-primary font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-md py-sm bg-error text-surface font-medium hover:opacity-90 transition-opacity rounded"
          >
            Logout
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-background border border-border p-lg mb-lg rounded">
          <p className="text-body text-text-primary mb-md">
            Total Products: <span className="font-bold text-primary">{products.length}</span>
          </p>
          <p className="text-caption text-text-secondary">
            To add/edit products, currently edit the JSON file at <code className="font-mono">src/data/products.json</code>
            and push to GitHub. Admin UI coming soon!
          </p>
        </div>

        {/* Products Table */}
        <div className="border border-border overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="text-left px-md py-sm text-body font-medium text-text-primary">Product</th>
                <th className="text-left px-md py-sm text-body font-medium text-text-primary">Brand</th>
                <th className="text-left px-md py-sm text-body font-medium text-text-primary">Category</th>
                <th className="text-right px-md py-sm text-body font-medium text-text-primary">Price</th>
                <th className="text-center px-md py-sm text-body font-medium text-text-primary">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-background transition-colors">
                  <td className="px-md py-sm text-body text-text-primary">{product.name}</td>
                  <td className="px-md py-sm text-body text-text-secondary">{product.brand}</td>
                  <td className="px-md py-sm text-caption text-text-secondary">
                    {product.category.replace('-', ' ')}
                  </td>
                  <td className="px-md py-sm text-body text-right font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-md py-sm text-center">
                    {product.featured ? (
                      <span className="text-success font-bold">✓</span>
                    ) : (
                      <span className="text-text-secondary">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-lg bg-warning bg-opacity-10 border border-warning text-warning-dark p-lg rounded">
          <h3 className="font-bold mb-sm text-body">Admin Panel Features Coming Soon</h3>
          <ul className="space-y-sm text-caption">
            <li>✓ Web form to add new products</li>
            <li>✓ Image upload and management</li>
            <li>✓ Edit existing products</li>
            <li>✓ Delete products</li>
            <li>✓ Bulk import from CSV</li>
            <li>✓ Auto-regenerate site after changes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
