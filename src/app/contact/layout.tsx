import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | VCSolar - Get Your Free Solar Quote',
  description: 'Contact VCSolar for premium solar solutions in Nigeria. Get a free estimate for solar panels, inverters, and batteries. Visit our Lagos showroom or reach us online.',
  keywords: 'contact VCSolar, solar quote Nigeria, solar estimate Lagos, solar installation contact, VCSolar showroom',
  openGraph: {
    title: 'Contact VCSolar - Free Solar Quote',
    description: 'Get expert solar solutions in Nigeria. Free estimates for residential and commercial solar installations.',
    url: 'https://vcsolar.shop/contact',
    siteName: 'VCSolar',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: {
    canonical: 'https://vcsolar.shop/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
