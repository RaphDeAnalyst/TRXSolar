import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | VCSolar - Solar Energy Questions Answered',
  description: 'Find answers to frequently asked questions about solar panels, inverters, batteries, and solar installation in Nigeria. Expert advice from VCSolar.',
  keywords: 'solar FAQ Nigeria, solar questions, solar installation help, VCSolar support',
  openGraph: {
    title: 'Frequently Asked Questions | VCSolar',
    description: 'Get answers to common questions about solar energy and installation in Nigeria.',
    url: 'https://vcsolar.shop/faq',
    siteName: 'VCSolar',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vcsolar.shop/faq',
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
