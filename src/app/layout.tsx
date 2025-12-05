import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';
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
      </head>
      <body>
        <Header />
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
