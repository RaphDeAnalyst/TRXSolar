import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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
async function fetchAllProducts(fields: 'card' | 'full' = 'card'): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?fields=${fields}`, {
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

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vcsolar.shop';

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
    const dbProducts = await fetchAllProducts('full');
    product = dbProducts.find((p) => p.id.toString() === id);
  }

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const productUrl = `${baseUrl}/products/${product.id}`;
  const imageUrl = product.media && product.media.length > 0
    ? product.media[0].url
    : product.image;

  return {
    title: `${product.name} | VCSolar - Premium Solar Solutions`,
    description: `${product.description} - ${product.brand} ${product.category.replace('-', ' ')}. ₦${product.price.toLocaleString('en-NG')}. High-quality solar equipment in Nigeria.`,
    keywords: `${product.name}, ${product.brand}, ${product.category.replace('-', ' ')}, solar energy, Nigeria, VCSolar`,
    openGraph: {
      title: `${product.name} | VCSolar`,
      description: product.description,
      url: productUrl,
      siteName: 'VCSolar',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | VCSolar`,
      description: product.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
    },
  };
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

  // If not found in JSON, try database with full fields for specs
  if (!product) {
    const dbProducts = await fetchAllProducts('full');
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

  // Generate Product Schema for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://vcsolar.shop';
  const imageUrl = product.media && product.media.length > 0
    ? product.media[0].url
    : product.image;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.id}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    },
    category: product.category.replace('-', ' '),
  };

  // Add aggregateRating if warranty info is available (optional enhancement)
  if (product.specs.warranty) {
    (productSchema as any).warranty = String(product.specs.warranty);
  }

  return (
    <div className="w-full">
      {/* Product Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Breadcrumb: Mobile-Optimized */}
      <div className="bg-background border-b border-border px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-text-secondary">
            <Link href="/products" className="hover:text-primary transition-colors">
              Products
            </Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">
              {product.category.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Mobile-First Container with Proper Edge Spacing */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-2xl mb-2xl">
          {/* Product Image Gallery */}
          <div>
            <ProductImageGallery
              productName={product.name}
              media={product.media}
              images={product.gallery || [product.image]}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {product.category.replace('-', ' ')}
              </span>
            </div>

            {/* Title: Fluid Typography - Mobile-First Responsive */}
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl text-text-primary font-display font-bold mb-3 tracking-tight">
                {product.name}
              </h1>
              <p className="text-base text-text-secondary">{product.brand}</p>
            </div>

            {/* Price & Warranty: Responsive Sizing */}
            <div className="py-4 border-t border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-xl md:text-2xl font-semibold text-primary">
                  ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {product.specs.warranty && (
                  <WarrantyBadge warranty={String(product.specs.warranty)} />
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-base text-text-primary leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications: Section Header with Proper Sizing */}
            <div className="border border-border rounded-lg">
              <h3 className="text-lg font-display font-semibold text-text-primary p-4 border-b border-border bg-background">
                Specifications
              </h3>
              <div className="divide-y divide-border">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-3">
                    <span className="text-sm md:text-base text-text-primary font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm md:text-base text-text-primary font-semibold">{value}</span>
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
