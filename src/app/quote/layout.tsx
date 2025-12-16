import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get a Free Solar Quote | VCSolar Nigeria',
  description: 'Request a free personalized solar quote for your home or business in Nigeria. Expert consultation and competitive pricing on solar panels, inverters, and batteries.',
  keywords: 'free solar quote Nigeria, solar estimate, solar installation quote, VCSolar pricing',
  openGraph: {
    title: 'Get a Free Solar Quote | VCSolar',
    description: 'Request your free personalized solar quote today. Expert consultation and competitive pricing.',
    url: 'https://vcsolar.shop/quote',
    siteName: 'VCSolar',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vcsolar.shop/quote',
  },
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
