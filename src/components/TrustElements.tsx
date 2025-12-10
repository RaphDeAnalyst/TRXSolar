'use client';

import { useState } from 'react';
import MapModal from '@/components/ui/MapModal';

interface TrustElementsProps {
  email: string;
  phone: string;
  officeHours: string;
  officeAddress: string;
}

export default function TrustElements({ email, phone, officeHours, officeAddress }: TrustElementsProps) {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Google Maps embed URL for preview (same as modal, but with overlay to indicate it's clickable)
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.306854729378!2d3.188016575949339!3d6.460049107566609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8e2e5e8cf1b7%3A0x7e1e9b7a5c3f3c5e!2sAlaba%20International%20Market!5e0!3m2!1sen!2sng!4v1234567890`;

  return (
    <div className="w-full bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-sm md:px-lg py-xl md:py-2xl">
        <h2 className="text-h2 text-text-primary font-display font-bold text-center mb-xl">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Column 1: Contact Information */}
          <div className="space-y-lg">
            {/* Email */}
            <div>
              <h3 className="text-body font-sans font-semibold text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </h3>
              <a
                href={`mailto:${email}`}
                className="text-primary hover:underline text-body block transition-colors"
              >
                {email}
              </a>
            </div>

            {/* Phone */}
            <div>
              <h3 className="text-body font-sans font-semibold text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </h3>
              <a
                href={`tel:${phone}`}
                className="text-primary hover:underline text-body block transition-colors"
              >
                {phone}
              </a>
            </div>

            {/* Business Hours */}
            <div>
              <h3 className="text-body font-sans font-semibold text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Business Hours
              </h3>
              <p className="text-text-secondary text-body">{officeHours}</p>
            </div>

            {/* Our Location */}
            <div>
              <h3 className="text-body font-sans font-semibold text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Our Location
              </h3>
              <p className="text-text-secondary text-body">{officeAddress}</p>
            </div>
          </div>

          {/* Column 2: Map Preview */}
          <div>
            {/* Map Preview with Interactive Overlay */}
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border shadow-lg group">
              {/* Embedded Map Preview (not fully interactive due to overlay) */}
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map preview showing VC Solar office location at Alaba International Market"
                className="w-full h-full border-0 pointer-events-none grayscale-[20%] contrast-110"
              />

              {/* Clickable Overlay - Makes entire area clickable and prevents map interaction */}
              <button
                type="button"
                onClick={() => setIsMapModalOpen(true)}
                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 hover:opacity-90 transition-all duration-300 cursor-pointer"
                aria-label="Open interactive map showing VC Solar office location at Alaba International Market"
              >
                {/* Professional Teal Badge/Pill CTA - Bottom Right */}
                <div className="absolute bottom-md right-md pointer-events-none">
                  <span className="px-md py-sm inline-flex bg-primary/95 backdrop-blur-sm text-white font-sans font-semibold transition-all duration-300 rounded-full shadow-lg items-center gap-xs text-sm group-hover:shadow-xl group-hover:scale-105">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>View Map</span>
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Map Modal */}
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          address={officeAddress}
        />
      </div>
    </div>
  );
}
