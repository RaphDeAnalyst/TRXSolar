import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Products | VCSolar - Panels, Inverters, Batteries & Accessories',
  description: 'Browse our complete range of high-quality solar products in Nigeria. Premium solar panels, inverters, batteries, and accessories for residential and commercial installations.',
  keywords: 'solar products Nigeria, solar panels, inverters, batteries, solar accessories, VCSolar catalog',
  openGraph: {
    title: 'Solar Products | VCSolar',
    description: 'Premium solar equipment for Nigerian homes and businesses. Complete solar solutions from trusted brands.',
    url: 'https://vcsolar.shop/products',
    siteName: 'VCSolar',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vcsolar.shop/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
