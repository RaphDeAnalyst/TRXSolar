'use client';

import { useState } from 'react';
import ContactHero from '@/components/ContactHero';
import IntentSelector from '@/components/IntentSelector';
import EstimateForm from '@/components/EstimateForm';
import GeneralInquiryForm from '@/components/GeneralInquiryForm';
import TrustElements from '@/components/TrustElements';

export default function ContactPage() {
  const [selectedIntent, setSelectedIntent] = useState<'estimate' | 'inquiry' | null>(null);

  // LocalBusiness Schema for SEO
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VCSolar',
    image: 'https://vcsolar.shop/solar_tech_banner.jpg',
    '@id': 'https://vcsolar.shop',
    url: 'https://vcsolar.shop',
    telephone: '+2348108698673',
    email: 'sales@vcsolar.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'F-Line F1720, Alaba International Market',
      addressLocality: 'Oja',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '17:30',
    },
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
    sameAs: [
      'https://www.facebook.com/vcsolar',
      'https://www.instagram.com/vcsolar',
    ],
  };

  const handleIntentChange = (intent: 'estimate' | 'inquiry') => {
    // Clear previous selection and set new intent
    // This ensures form data is cleared when switching
    setSelectedIntent(null);
    setTimeout(() => setSelectedIntent(intent), 50);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* LocalBusiness Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero Section */}
      <ContactHero
        title="Start Your Solar Journey"
        subtitle="Get a free estimate or ask us anything"
        backgroundImage="/solar_tech_banner.jpg"
      />

      {/* Main Content - Intent Selector & Forms */}
      <div className="w-full bg-surface">
        <div className="max-w-5xl mx-auto px-sm md:px-lg py-xl md:py-2xl">
          {/* Intent Selector */}
          <IntentSelector
            onSelectIntent={handleIntentChange}
            selectedIntent={selectedIntent}
          />

          {/* Form Section - Scroll Target */}
          <div id="contact-form-section" className="scroll-mt-lg">
            {/* Estimate Form */}
            {selectedIntent === 'estimate' && (
              <div
                className="animate-fadeIn"
                key="estimate-form"
              >
                <EstimateForm />
              </div>
            )}

            {/* General Inquiry Form */}
            {selectedIntent === 'inquiry' && (
              <div
                className="animate-fadeIn"
                key="inquiry-form"
              >
                <GeneralInquiryForm />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust Elements Section */}
      <TrustElements
        email="sales@vcsolar.com"
        phone="+2348108698673"
        officeHours="Mon-Fri: 8:30 AM - 5:30 PM"
        officeAddress="F-Line F1720, Alaba International Market, Oja, Lagos State"
      />
    </div>
  );
}
