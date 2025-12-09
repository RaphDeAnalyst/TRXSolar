import { Product } from '@/lib/types';
import { selectRelatedProducts } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

export default function RelatedProducts({ currentProduct, allProducts }: RelatedProductsProps) {
  const relatedProducts = selectRelatedProducts(currentProduct, allProducts);

  // Don't show section if no related products
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-2xl">
      <h2 className="text-h2 text-text-primary font-medium mb-lg">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
