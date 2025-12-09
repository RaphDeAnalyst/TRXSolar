import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppChat from '@/components/WhatsAppChat';
import './globals.css';

export const metadata: Metadata = {
  title: 'TRXSolar - Premium Solar Solutions',
  description: 'High-quality solar panels, inverters, and batteries for residential and commercial installations.',
  keywords: 'solar panels, inverters, batteries, renewable energy, solar installation',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#007A87" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main className="min-h-[calc(100vh-200px)] pt-[var(--header-height)]">{children}</main>
        <Footer />
        <WhatsAppChat />
      </body>
    </html>
  );
}
