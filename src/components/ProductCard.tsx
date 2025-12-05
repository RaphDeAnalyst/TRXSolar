import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <article className="bg-surface border border-border hover:border-primary cursor-pointer transition-colors h-full flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-background overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={product.featured}
          />
        </div>

        {/* Content */}
        <div className="p-md flex-1 flex flex-col justify-between">
          {/* Category Badge */}
          <div className="mb-sm">
            <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Name */}
          <h3 className="text-body font-medium text-text-primary mb-sm line-clamp-2">
            {product.name}
          </h3>

          {/* Brand */}
          <p className="text-caption text-text-secondary mb-md">{product.brand}</p>

          {/* Specs Preview */}
          <div className="text-caption text-text-secondary space-y-xs mb-md">
            {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span>{key.replace(/_/g, ' ')}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="text-lg font-bold text-primary">
            ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </article>
    </Link>
  );
}
