'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { Contact } from '@/types';
import productsData from '@/data/products.json';
import AdminProductTable from '@/components/admin/AdminProductTable';
import AdminProductForm from '@/components/admin/AdminProductForm';
import AdminContactTable from '@/components/admin/AdminContactTable';
import { generateSKU } from '@/lib/admin/skuGenerator';
import { useToast } from '@/components/contexts/ToastContext';

// Session management constants
const ADMIN_SESSION_KEY = 'vcsolar_admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface AdminSession {
  authenticated: boolean;
  timestamp: number;
}

export default function AdminPage() {
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Contact management state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'contacts'>('products');
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('all');

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'solar2024';

  // Check for existing valid session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);

        if (storedSession) {
          const session: AdminSession = JSON.parse(storedSession);
          const now = Date.now();
          const sessionAge = now - session.timestamp;

          // Check if session is still valid (less than 7 days old)
          if (session.authenticated && sessionAge < SESSION_DURATION) {
            setIsAuthenticated(true);
            console.log(`Session valid. Expires in ${Math.floor((SESSION_DURATION - sessionAge) / (24 * 60 * 60 * 1000))} days.`);
          } else {
            // Session expired, clear it
            localStorage.removeItem(ADMIN_SESSION_KEY);
            console.log('Session expired. Please login again.');
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        localStorage.removeItem(ADMIN_SESSION_KEY);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkExistingSession();
  }, []);

  // Load products on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadContacts();
    }
  }, [isAuthenticated]);

  // Load products from database and merge with JSON
  const loadProducts = async () => {
    try {
      // Load from JSON file first
      const jsonProducts: Product[] = [];
      Object.values(productsData).forEach((categoryProducts) => {
        jsonProducts.push(...(categoryProducts as Product[]));
      });

      // Try to load from database
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.products) {
          // Map database products to Product type
          const dbProducts: Product[] = data.products.map((p: any) => {
            // Parse media array
            let mediaArray = [];
            try {
              mediaArray = typeof p.media === 'string' ? JSON.parse(p.media) : (Array.isArray(p.media) ? p.media : []);
            } catch (e) {
              mediaArray = [];
            }

            // Parse specs object
            let specsObj = {};
            try {
              specsObj = typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {});
            } catch (e) {
              specsObj = {};
            }

            return {
              id: p.id?.toString() || `db-${p.name}`,
              name: p.name,
              brand: p.brand || 'Unknown',
              category: p.category || 'solar-panels',
              price: parseFloat(p.price) || 0,
              image: p.image || (mediaArray[0]?.url) || '/images/placeholder.jpg',
              media: mediaArray,
              description: p.description || '',
              specs: specsObj,
              featured: p.featured || false,
              createdAt: p.created_at
            };
          });

          // Merge products (database products take precedence)
          setProducts([...jsonProducts, ...dbProducts]);
          console.log(`Loaded ${jsonProducts.length} JSON products + ${dbProducts.length} database products`);
        } else {
          setProducts(jsonProducts);
        }
      } else {
        setProducts(jsonProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fall back to JSON products
      const jsonProducts: Product[] = [];
      Object.values(productsData).forEach((categoryProducts) => {
        jsonProducts.push(...(categoryProducts as Product[]));
      });
      setProducts(jsonProducts);
    }
  };

  // Load contacts from API
  const loadContacts = async () => {
    console.log('📋 [ADMIN] ========================================');
    console.log('📋 [ADMIN] Loading contacts...');
    console.log('📋 [ADMIN] Timestamp:', new Date().toISOString());
    console.log('📋 [ADMIN] Using password:', ADMIN_PASSWORD.substring(0, 5) + '...');

    setIsLoadingContacts(true);

    try {
      console.log('📋 [ADMIN] Making fetch request to /api/admin/contacts');

      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });

      console.log('📋 [ADMIN] Response received');
      console.log('📋 [ADMIN] Response status:', response.status);
      console.log('📋 [ADMIN] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('📋 [ADMIN] ❌ HTTP error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 [ADMIN] Response data structure:', {
        success: data.success,
        contactsCount: data.contacts?.length,
        timestamp: data.timestamp
      });
      console.log('📋 [ADMIN] Full response data:', JSON.stringify(data, null, 2));

      if (data.success) {
        console.log(`📋 [ADMIN] Setting contacts state with ${data.contacts.length} contacts`);
        setContacts(data.contacts);
        console.log('📋 [ADMIN] ✅ Successfully loaded contacts from database');
        console.log('📋 [ADMIN] First 2 contacts:', JSON.stringify(data.contacts.slice(0, 2), null, 2));

        showToast({
          type: 'success',
          message: `Loaded ${data.contacts.length} contacts successfully`
        });
      } else {
        console.error('📋 [ADMIN] ❌ API returned success:false -', data.error);
        showToast({
          type: 'error',
          message: 'Failed to load contacts: ' + (data.error || 'Unknown error')
        });
      }
    } catch (error) {
      console.error('📋 [ADMIN] ❌ Exception during fetch:', error);
      console.error('📋 [ADMIN] Error details:', error instanceof Error ? error.stack : error);
      showToast({
        type: 'error',
        message: 'Failed to load contacts: ' + (error instanceof Error ? error.message : 'Network error')
      });
    } finally {
      setIsLoadingContacts(false);
    }

    console.log('📋 [ADMIN] ========================================');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      // Create session and store in localStorage
      const session: AdminSession = {
        authenticated: true,
        timestamp: Date.now(),
      };

      try {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
        setIsAuthenticated(true);
        setPassword('');
        console.log('Login successful. Session will expire in 7 days.');
      } catch (error) {
        console.error('Error storing session:', error);
        showToast({
          type: 'error',
          message: 'Error creating session. Please try again.'
        });
      }
    } else {
      showToast({
        type: 'error',
        message: 'Incorrect password'
      });
      setPassword('');
    }
  };

  const handleLogout = () => {
    // Clear session from localStorage
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      console.log('Logged out successfully.');
    } catch (error) {
      console.error('Error clearing session:', error);
    }

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

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast({
          type: 'success',
          message: 'Product deleted successfully from database!'
        });
      } else {
        throw new Error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: `Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        },
        body: JSON.stringify({
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          image: product.image,
          description: product.description,
          specs: product.specs,
          media: product.media || [],
          featured: !currentStatus
        })
      });

      const data = await response.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, featured: !currentStatus } : p))
        );
      } else {
        throw new Error(data.error || 'Failed to update product');
      }
    } catch (error) {
      showToast({
        type: 'error',
        message: `Error updating featured status: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleFormSubmit = async (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      try {
        const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_PASSWORD}`
          },
          body: JSON.stringify({
            name: productData.name,
            brand: productData.brand,
            category: productData.category,
            price: productData.price,
            image: productData.image,
            description: productData.description,
            specs: productData.specs,
            media: productData.media || [],
            featured: productData.featured
          })
        });

        const data = await response.json();
        if (data.success) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
          );
          showToast({
            type: 'success',
            message: 'Product updated successfully!'
          });
        } else {
          throw new Error(data.error || 'Failed to update product');
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        return;
      }
    } else {
      // Create new product with auto-generated SKU
      try {
        const sku = generateSKU(productData, products);

        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_PASSWORD}`
          },
          body: JSON.stringify({
            id: sku,
            name: productData.name,
            brand: productData.brand,
            category: productData.category,
            price: productData.price,
            image: productData.image,
            description: productData.description,
            specs: productData.specs,
            media: productData.media || [],
            featured: productData.featured
          })
        });

        const data = await response.json();
        if (data.success) {
          const newProduct: Product = {
            id: sku,
            name: productData.name || '',
            brand: productData.brand || '',
            category: productData.category || 'solar-panels',
            price: productData.price || 0,
            image: productData.image || '',
            media: productData.media || [],
            description: productData.description || '',
            specs: productData.specs || {},
            featured: productData.featured || false,
            createdAt: new Date().toISOString(),
          };
          setProducts((prev) => [...prev, newProduct]);
          showToast({
            type: 'success',
            message: `Product created with SKU: ${sku} and saved to database!`,
            duration: 7000
          });
        } else {
          throw new Error(data.error || 'Failed to create product');
        }
      } catch (error) {
        showToast({
          type: 'error',
          message: `Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
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

  // Contact management handlers
  const handleUpdateStatus = async (contactId: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();
      if (data.success) {
        setContacts(prev => prev.map(c =>
          c.id === contactId ? { ...c, status: status as Contact['status'] } : c
        ));
      } else {
        showToast({
          type: 'error',
          message: 'Failed to update contact status'
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      showToast({
        type: 'error',
        message: 'Failed to update contact status'
      });
    }
  };

  const handleDeleteContact = async (contactId: number) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_PASSWORD}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
      } else {
        showToast({
          type: 'error',
          message: 'Failed to delete contact'
        });
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      showToast({
        type: 'error',
        message: 'Failed to delete contact'
      });
    }
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

  // Filter contacts based on search and status
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contactSearch === '' ||
      contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
      contact.message.toLowerCase().includes(contactSearch.toLowerCase());

    const matchesStatus = contactStatusFilter === 'all' ||
      contact.status === contactStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="w-full">
        <div className="max-w-md mx-auto px-sm py-2xl flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-md"></div>
            <p className="text-body text-text-secondary">Checking session...</p>
          </div>
        </div>
      </div>
    );
  }

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

            {/* Session Info */}
            <div className="bg-primary/10 border border-primary rounded p-sm">
              <p className="text-caption text-text-secondary text-center">
                🔒 Sessions last for <strong>7 days</strong> and persist across browser restarts
              </p>
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-md mb-lg">
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
          <div className="bg-surface border border-border p-md rounded-lg">
            <p className="text-caption text-text-secondary mb-xs">New Contacts</p>
            <p className="text-h2 font-display font-bold text-warning">
              {contacts.filter((c) => c.status === 'new').length}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-surface border border-border rounded-lg mb-lg">
          <div className="flex gap-sm p-sm">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-md px-lg rounded transition-colors ${
                activeTab === 'products'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary hover:text-text-primary'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 py-md px-lg rounded transition-colors ${
                activeTab === 'contacts'
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary hover:text-text-primary'
              }`}
            >
              Contacts ({contacts.length})
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'products' ? (
          <>
            {/* Product Management - Action Bar */}
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

          </>
        ) : (
          <>
            {/* Contact Management - Search and Filter Bar */}
            <div className="bg-surface border border-border p-md rounded-lg mb-lg">
              <div className="flex flex-col md:flex-row gap-md items-stretch md:items-center justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <label htmlFor="contact-search" className="sr-only">
                    Search contacts
                  </label>
                  <input
                    type="text"
                    id="contact-search"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    placeholder="Search by name, email, or message..."
                    className="w-full px-md py-sm border border-border bg-background focus:border-primary focus:outline-none rounded"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-full md:w-auto">
                  <label htmlFor="status-filter" className="sr-only">
                    Filter by status
                  </label>
                  <select
                    id="status-filter"
                    value={contactStatusFilter}
                    onChange={(e) => setContactStatusFilter(e.target.value)}
                    className="w-full md:w-auto px-md py-sm border border-border bg-background focus:border-primary focus:outline-none rounded"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={loadContacts}
                  className="w-full md:w-auto px-md py-sm min-h-touch bg-primary text-white font-sans font-semibold hover:bg-primary-dark transition-colors rounded shadow-md flex items-center justify-center gap-xs"
                  title="Refresh contacts"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-md">
              <p className="text-body text-text-secondary">
                Showing <span className="font-semibold text-text-primary">{filteredContacts.length}</span> of{' '}
                <span className="font-semibold text-text-primary">{contacts.length}</span> contacts
              </p>
            </div>

            {/* Debug Info - Remove after testing */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-md mb-md">
              <h4 className="font-semibold text-sm mb-2">Debug Info:</h4>
              <p className="text-sm">Total contacts: {contacts.length}</p>
              <p className="text-sm">Filtered contacts: {filteredContacts.length}</p>
              <p className="text-sm">Search query: "{contactSearch}"</p>
              <p className="text-sm">Status filter: {contactStatusFilter}</p>
              {contacts.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">View first contact</summary>
                  <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(contacts[0], null, 2)}</pre>
                </details>
              )}
            </div>

            {/* Contacts Table */}
            {isLoadingContacts || filteredContacts.length > 0 ? (
              <AdminContactTable
                contacts={filteredContacts}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteContact}
                isLoading={isLoadingContacts}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="text-h3 font-display font-medium text-text-primary mb-sm">No contacts found</h3>
                <p className="text-body text-text-secondary">
                  {contactSearch || contactStatusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No contact submissions yet'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <AdminProductForm
          product={editingProduct}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          adminPassword={ADMIN_PASSWORD}
        />
      )}
    </div>
  );
}
