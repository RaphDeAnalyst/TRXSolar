'use client';

import { useState } from 'react';
import ContactHero from '@/components/ContactHero';
import IntentSelector from '@/components/IntentSelector';
import EstimateForm from '@/components/EstimateForm';
import GeneralInquiryForm from '@/components/GeneralInquiryForm';
import TrustElements from '@/components/TrustElements';

export default function ContactPage() {
  const [selectedIntent, setSelectedIntent] = useState<'estimate' | 'inquiry' | null>(null);

  const handleIntentChange = (intent: 'estimate' | 'inquiry') => {
    // Clear previous selection and set new intent
    // This ensures form data is cleared when switching
    setSelectedIntent(null);
    setTimeout(() => setSelectedIntent(intent), 50);
  };

  return (
    <div className="w-full min-h-screen bg-background">
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
        email="sales@trxsolar.com"
        phone="+2348108698673"
        officeHours="Mon-Fri: 8:30 AM - 5:30 PM"
        officeAddress="Plot 20, Ewet Housing Estate, Uyo, Akwa Ibom"
      />
    </div>
  );
}
