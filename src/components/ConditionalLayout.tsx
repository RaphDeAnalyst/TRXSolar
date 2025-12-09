'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';

/**
 * ConditionalLayout - Controls which components appear based on route
 *
 * Admin routes (/admin/*) get a minimal layout without:
 * - Header navigation
 * - Footer
 * - WhatsApp floating icon
 *
 * Public routes get the full website layout with all components.
 */
export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin layout - no public components
    return <main className="min-h-screen">{children}</main>;
  }

  // Public website layout - full components
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-200px)] pt-[var(--header-height)]">{children}</main>
      <Footer />
      <WhatsAppChat />
    </>
  );
}
