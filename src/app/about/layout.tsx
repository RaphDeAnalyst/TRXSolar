import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About VCSolar | Premium Solar Solutions in Nigeria',
  description: 'Learn about VCSolar, your trusted partner for premium solar solutions in Nigeria. Quality solar panels, inverters, and batteries for homes and businesses.',
  keywords: 'about VCSolar, solar company Nigeria, solar solutions Lagos, renewable energy Nigeria',
  openGraph: {
    title: 'About VCSolar',
    description: 'Your trusted partner for premium solar solutions in Nigeria.',
    url: 'https://vcsolar.shop/about',
    siteName: 'VCSolar',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vcsolar.shop/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
