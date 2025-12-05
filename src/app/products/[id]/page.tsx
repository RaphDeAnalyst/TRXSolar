import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import productsData from '@/data/products.json';
import { Product } from '@/lib/types';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  const allProducts: Product[] = [];
  Object.values(productsData).forEach((categoryProducts) => {
    allProducts.push(...categoryProducts);
  });
  return allProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Find product
  let product: Product | undefined;
  let categoryKey: string | undefined;

  for (const [key, products] of Object.entries(productsData)) {
    const found = (products as Product[]).find((p) => p.id === id);
    if (found) {
      product = found;
      categoryKey = key;
      break;
    }
  }

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const categoryProducts = (productsData[categoryKey as keyof typeof productsData] as Product[]) || [];
  const relatedProducts = categoryProducts
    .filter((p) => p.id !== product!.id)
    .slice(0, 3);

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
          {/* Product Image */}
          <div>
            <div className="bg-background aspect-square relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Gallery Thumbnails */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-md mt-md">
                {product.gallery.map((image, idx) => (
                  <div key={idx} className="bg-background aspect-square relative">
                    <Image
                      src={image}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover cursor-pointer hover:opacity-75"
                    />
                  </div>
                ))}
              </div>
            )}
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

            {/* Price */}
            <div className="py-md border-t border-b border-border">
              <div className="text-3xl font-bold text-primary">₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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

            {/* CTA */}
            <button className="w-full bg-primary text-surface py-md min-h-touch font-medium hover:bg-primary-dark transition-colors">
              Request Quote
            </button>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-2xl">
            <h2 className="text-h2 text-text-primary font-medium mb-lg">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
