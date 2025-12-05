import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-text-primary text-surface mt-xl py-lg">
      <div className="max-w-7xl mx-auto px-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-lg">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-md">TRXSolar</h3>
            <p className="text-sm text-gray-300">
              Premium solar solutions for residential and commercial installations.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-md">Products</h3>
            <ul className="space-y-sm text-sm">
              <li>
                <Link href="/products?category=solar-panels" className="hover:text-primary">
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link href="/products?category=inverters" className="hover:text-primary">
                  Inverters
                </Link>
              </li>
              <li>
                <Link href="/products?category=batteries" className="hover:text-primary">
                  Batteries
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-md">Company</h3>
            <ul className="space-y-sm text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-md">Legal</h3>
            <ul className="space-y-sm text-sm">
              <li>
                <a href="#" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-md text-center text-sm text-gray-300">
          <p>&copy; 2024 TRXSolar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
