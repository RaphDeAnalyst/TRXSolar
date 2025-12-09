interface TrustElementsProps {
  email: string;
  phone: string;
  officeHours: string;
  officeAddress: string;
}

export default function TrustElements({ email, phone, officeHours, officeAddress }: TrustElementsProps) {
  return (
    <div className="w-full bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-sm md:px-lg py-xl md:py-2xl">
        <h2 className="text-h2 text-text-primary font-bold text-center mb-xl">
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {/* Contact Information */}
          <div className="space-y-md">
            <div>
              <h3 className="text-body font-medium text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </h3>
              <a
                href={`mailto:${email}`}
                className="text-primary hover:underline text-body block"
              >
                {email}
              </a>
            </div>

            <div>
              <h3 className="text-body font-medium text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </h3>
              <a
                href={`tel:${phone}`}
                className="text-primary hover:underline text-body block"
              >
                {phone}
              </a>
            </div>
          </div>

          {/* Business Hours & Location */}
          <div className="space-y-md">
            <div>
              <h3 className="text-body font-medium text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Business Hours
              </h3>
              <p className="text-text-secondary text-body">{officeHours}</p>
            </div>

            <div>
              <h3 className="text-body font-medium text-text-primary mb-sm flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Our Location
              </h3>
              <p className="text-text-secondary text-body">{officeAddress}</p>
            </div>
          </div>

          {/* Google Maps */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-body font-medium text-text-primary mb-sm">Find Us</h3>
            <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.5657896384855!2d7.9336!3d5.0204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDEnMTMuNCJOIDfCsDU2JzAxLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TRX Solar Office Location - Plot 20, Ewet Housing Estate, Uyo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
