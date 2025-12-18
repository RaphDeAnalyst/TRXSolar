import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import HomeHero from '@/components/HomeHero';
import { Product } from '@/lib/types';

async function getProducts() {
  try {
    // Fetch ONLY featured products from API (PERFORMANCE OPTIMIZATION)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/products?featured=true&fields=featured&limit=6`,
      {
        // PHASE 3: Enable edge caching with revalidation
        cache: 'force-cache',
        next: {
          tags: ['featured-products'],
          revalidate: 3600 // Revalidate every hour
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.products) {
        console.log(`[Homepage] Loaded ${data.products.length} featured products`);
        if (data._performance) {
          console.log(`[Homepage] 📊 Performance: Query ${data._performance.query_ms}ms, Total ${data._performance.total_ms}ms`);
        }
        return data.products.map((p: any) => ({
          id: p.id?.toString() || `db-${p.name}`,
          name: p.name,
          brand: p.brand || 'Unknown',
          category: p.category || 'solar-panels',
          price: parseFloat(p.price) || 0,
          image: p.image || '/images/placeholder.jpg',
          media: typeof p.media === 'string' ? JSON.parse(p.media) : (p.media || []),
          description: p.description || '',
          specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || {}),
          featured: p.featured || false,
        }));
      }
    }
  } catch (error) {
    console.error('[Homepage] Failed to load featured products:', error);
  }
  return [];
}

export default async function Home() {
  // Get featured products from database (already filtered and limited to 6)
  const featuredProducts = await getProducts();

  return (
    <>
      {/* Unified Hero Component */}
      <HomeHero />

      {/* Shop by Category Section - Premium Bento Grid */}
      <section id="shop-categories" className="py-12 md:py-16 bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8 text-center">
            Shop by Category
          </h2>

          {/* Mobile: 2-column grid | Desktop: 12-column Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">

            {/* Solar Panels - Hero Card (6 columns, spans 2 rows on desktop) */}
            <Link
              href="/products?category=solar-panels"
              className="group relative overflow-hidden rounded-3xl
                         col-span-2 md:col-span-6 md:row-span-2
                         min-h-[200px] md:min-h-[400px]
                         hover:scale-[1.02] transition-transform duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/category-solar-panel.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Glassmorphism Badge - Bottom Left */}
              <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                <span className="text-white font-bold text-lg md:text-xl font-display">
                  Solar Panels
                </span>
              </div>
            </Link>

            {/* Inverters - Top Right (6 columns, 1 row) */}
            <Link
              href="/products?category=inverters"
              className="group relative overflow-hidden rounded-3xl
                         col-span-1 md:col-span-6
                         min-h-[200px] md:min-h-[190px]
                         hover:scale-[1.02] transition-transform duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/category-inverters.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Glassmorphism Badge - Bottom Left */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                <span className="text-white font-bold text-base md:text-lg font-display">
                  Inverters
                </span>
              </div>
            </Link>

            {/* Batteries - Middle Right (3 columns, 1 row) */}
            <Link
              href="/products?category=batteries"
              className="group relative overflow-hidden rounded-3xl
                         col-span-1 md:col-span-3
                         min-h-[200px] md:min-h-[190px]
                         hover:scale-[1.02] transition-transform duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/category-batteries.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Glassmorphism Badge - Bottom Left */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                <span className="text-white font-bold text-base md:text-lg font-display">
                  Batteries
                </span>
              </div>
            </Link>

            {/* Charge Controllers - Bottom Right (3 columns, 1 row) */}
            <Link
              href="/products?category=accessories"
              className="group relative overflow-hidden rounded-3xl
                         col-span-2 md:col-span-3
                         min-h-[200px] md:min-h-[190px]
                         hover:scale-[1.02] transition-transform duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/category-charge-controllers.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Glassmorphism Badge - Bottom Left */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                <span className="text-white font-bold text-base md:text-lg font-display">
                  Charge Controllers
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8 text-center">Featured Products</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-text-primary mb-8 text-center">Why Choose VCSolar</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="bg-surface border border-border p-md">
              <div className="text-2xl mb-md">✓</div>
              <h3 className="text-body font-medium text-text-primary mb-sm">Premium Quality</h3>
              <p className="text-caption text-text-secondary">
                Certified products from trusted manufacturers with proven reliability.
              </p>
            </div>

            <div className="bg-surface border border-border p-md">
              <div className="text-2xl mb-md">✓</div>
              <h3 className="text-body font-medium text-text-primary mb-sm">Competitive Pricing</h3>
              <p className="text-caption text-text-secondary">
                Best prices in the market without compromising on quality.
              </p>
            </div>

            <div className="bg-surface border border-border p-md">
              <div className="text-2xl mb-md">✓</div>
              <h3 className="text-body font-medium text-text-primary mb-sm">Expert Support</h3>
              <p className="text-caption text-text-secondary">
                Professional guidance for selecting the right products for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-text-primary text-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-surface mb-6">Ready to Go Solar?</h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed">
            Get in touch with our team to discuss your solar energy needs and find the perfect solution.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-surface px-8 py-4 min-h-[56px] font-display font-semibold hover:bg-primary-dark transition-colors shadow-lg rounded-lg"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  );
}
