import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ImageCarousel from '@/components/ImageCarousel';
import productsData from '@/data/products.json';

export default function Home() {
  // Get featured products from all categories
  const allProducts = [
    ...productsData['solar-panels'],
    ...productsData.inverters,
    ...productsData.batteries,
  ];

  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 6);

  // Extract images for carousels
  const solarPanelImages = productsData['solar-panels'].map((p) => p.image);
  const inverterImages = productsData.inverters.map((p) => p.image);

  return (
    <>
      {/* Hero Section - Split with Carousels */}
      <section className="w-screen h-screen flex flex-col md:flex-row">
        {/* Left - Solar Panels */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
          <ImageCarousel images={solarPanelImages} alt="Solar Panel" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center text-white px-sm">
              <h2 className="text-h1 md:text-h1 font-bold mb-md">Solar Panels</h2>
              <p className="text-body mb-lg max-w-md mx-auto">
                High-efficiency solar panels for maximum energy generation
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center">
                <Link
                  href="/quote"
                  className="inline-block bg-primary text-surface px-lg py-sm min-h-touch font-medium hover:bg-primary-dark transition-colors shadow-md border border-white/20"
                >
                  Get Your Free Quote
                </Link>
                <Link
                  href="/products?category=solar-panels"
                  className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white px-lg py-sm min-h-touch font-medium hover:bg-white/20 transition-colors"
                >
                  Shop Solar Panels
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Inverters */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full">
          <ImageCarousel images={inverterImages} alt="Inverter" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center text-white px-sm">
              <h2 className="text-h1 md:text-h1 font-bold mb-md">Inverters</h2>
              <p className="text-body mb-lg max-w-md mx-auto">
                Premium inverters for reliable power conversion
              </p>
              <div className="flex flex-col sm:flex-row gap-md justify-center">
                <Link
                  href="/quote"
                  className="inline-block bg-primary text-surface px-lg py-sm min-h-touch font-medium hover:bg-primary-dark transition-colors shadow-md border border-white/20"
                >
                  Get Your Free Quote
                </Link>
                <Link
                  href="/products?category=inverters"
                  className="inline-block bg-white/10 backdrop-blur-sm text-white border border-white px-lg py-sm min-h-touch font-medium hover:bg-white/20 transition-colors"
                >
                  Shop Inverters
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full">
        {/* Categories Section */}
        <section className="py-lg px-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-h2 text-text-primary mb-lg font-medium">Shop by Category</h2>

          <div className="flex flex-wrap justify-center gap-md">
            <Link
              href="/products?category=solar-panels"
              className="bg-primary text-surface px-lg py-md min-h-touch font-medium hover:bg-primary-dark transition-colors"
            >
              Solar Panels
            </Link>
            <Link
              href="/products?category=inverters"
              className="bg-primary text-surface px-lg py-md min-h-touch font-medium hover:bg-primary-dark transition-colors"
            >
              Inverters
            </Link>
            <Link
              href="/products?category=batteries"
              className="bg-primary text-surface px-lg py-md min-h-touch font-medium hover:bg-primary-dark transition-colors"
            >
              Batteries
            </Link>
            <Link
              href="/products?category=accessories"
              className="bg-primary text-surface px-lg py-md min-h-touch font-medium hover:bg-primary-dark transition-colors"
            >
              Charge Controllers
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-lg px-sm bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-h2 text-text-primary mb-lg font-medium">Featured Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-lg px-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 text-text-primary mb-lg font-medium">Why Choose TRXSolar</h2>

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
      <section className="py-lg px-sm bg-text-primary text-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 text-surface mb-md font-medium">Ready to Go Solar?</h2>
          <p className="text-body mb-lg">
            Get in touch with our team to discuss your solar energy needs and find the perfect solution.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-surface px-lg py-sm min-h-touch font-medium hover:bg-primary-dark transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}
