import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductCTAButtons from '@/components/ProductCTAButtons';
import WarrantyBadge from '@/components/WarrantyBadge';
import WishlistButton from '@/components/WishlistButton';
import RelatedProducts from '@/components/RelatedProducts';
import productsData from '@/data/products.json';
import { Product } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to fetch products from API
async function fetchAllProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return data.products || [];
    }
  } catch (error) {
    console.error('Failed to fetch products from API:', error);
  }

  return [];
}

export async function generateStaticParams() {
  // Get products from JSON
  const jsonProducts: Product[] = [];
  Object.values(productsData).forEach((categoryProducts) => {
    jsonProducts.push(...(categoryProducts as Product[]));
  });

  // Get products from database
  const dbProducts = await fetchAllProducts();

  // Combine all products
  const allProducts = [...jsonProducts, ...dbProducts];

  return allProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Find product in JSON first
  let product: Product | undefined;

  for (const [, products] of Object.entries(productsData)) {
    const found = (products as Product[]).find((p) => p.id === id);
    if (found) {
      product = found;
      break;
    }
  }

  // If not found in JSON, try database
  if (!product) {
    const dbProducts = await fetchAllProducts();
    product = dbProducts.find((p) => p.id.toString() === id);
  }

  if (!product) {
    notFound();
  }

  // Get all products for related products algorithm
  const jsonProducts: Product[] = [];
  Object.values(productsData).forEach((categoryProducts) => {
    jsonProducts.push(...(categoryProducts as Product[]));
  });
  const dbProducts = await fetchAllProducts();
  const allProducts = [...jsonProducts, ...dbProducts];

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border px-sm py-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-sm text-caption text-text-secondary">
            <Link href="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-primary">
              {product.category.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-sm py-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2xl mb-2xl">
          {/* Product Image Gallery */}
          <div>
            <ProductImageGallery
              productName={product.name}
              media={product.media}
              images={product.gallery || [product.image]}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-lg">
            {/* Category Badge */}
            <div>
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {product.category.replace('-', ' ')}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-h1 text-text-primary font-bold mb-sm">{product.name}</h1>
              <p className="text-body text-text-secondary">{product.brand}</p>
            </div>

            {/* Price & Warranty */}
            <div className="py-md border-t border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-md">
                <div className="text-3xl font-bold text-primary">₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                {product.specs.warranty && (
                  <WarrantyBadge warranty={String(product.specs.warranty)} />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-body text-text-primary leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="border border-border">
              <h3 className="text-body font-medium text-text-primary p-md border-b border-border bg-background">
                Specifications
              </h3>
              <div className="divide-y divide-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-md">
                    <span className="text-body text-text-primary font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-body text-text-primary font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wishlist Button */}
            <WishlistButton productId={product.id} productName={product.name} />

            {/* Dual CTAs */}
            <ProductCTAButtons product={product} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} allProducts={allProducts} />
      </div>
    </div>
  );
}
