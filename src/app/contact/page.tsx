'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';

// Comprehensive list of countries with ISO codes, calling codes, and flags
// Sorted alphabetically by country name for better UX
const COUNTRY_CODES = [
  { code: '+93', name: 'Afghanistan', iso: 'AF', flag: '🇦🇫' },
  { code: '+355', name: 'Albania', iso: 'AL', flag: '🇦🇱' },
  { code: '+213', name: 'Algeria', iso: 'DZ', flag: '🇩🇿' },
  { code: '+376', name: 'Andorra', iso: 'AD', flag: '🇦🇩' },
  { code: '+244', name: 'Angola', iso: 'AO', flag: '🇦🇴' },
  { code: '+54', name: 'Argentina', iso: 'AR', flag: '🇦🇷' },
  { code: '+374', name: 'Armenia', iso: 'AM', flag: '🇦🇲' },
  { code: '+61', name: 'Australia', iso: 'AU', flag: '🇦🇺' },
  { code: '+43', name: 'Austria', iso: 'AT', flag: '🇦🇹' },
  { code: '+994', name: 'Azerbaijan', iso: 'AZ', flag: '🇦🇿' },
  { code: '+973', name: 'Bahrain', iso: 'BH', flag: '🇧🇭' },
  { code: '+880', name: 'Bangladesh', iso: 'BD', flag: '🇧🇩' },
  { code: '+375', name: 'Belarus', iso: 'BY', flag: '🇧🇾' },
  { code: '+32', name: 'Belgium', iso: 'BE', flag: '🇧🇪' },
  { code: '+501', name: 'Belize', iso: 'BZ', flag: '🇧🇿' },
  { code: '+229', name: 'Benin', iso: 'BJ', flag: '🇧🇯' },
  { code: '+975', name: 'Bhutan', iso: 'BT', flag: '🇧🇹' },
  { code: '+591', name: 'Bolivia', iso: 'BO', flag: '🇧🇴' },
  { code: '+387', name: 'Bosnia', iso: 'BA', flag: '🇧🇦' },
  { code: '+267', name: 'Botswana', iso: 'BW', flag: '🇧🇼' },
  { code: '+55', name: 'Brazil', iso: 'BR', flag: '🇧🇷' },
  { code: '+673', name: 'Brunei', iso: 'BN', flag: '🇧🇳' },
  { code: '+359', name: 'Bulgaria', iso: 'BG', flag: '🇧🇬' },
  { code: '+226', name: 'Burkina Faso', iso: 'BF', flag: '🇧🇫' },
  { code: '+257', name: 'Burundi', iso: 'BI', flag: '🇧🇮' },
  { code: '+855', name: 'Cambodia', iso: 'KH', flag: '🇰🇭' },
  { code: '+237', name: 'Cameroon', iso: 'CM', flag: '🇨🇲' },
  { code: '+1', name: 'Canada', iso: 'CA', flag: '🇨🇦' },
  { code: '+238', name: 'Cape Verde', iso: 'CV', flag: '🇨🇻' },
  { code: '+236', name: 'Central African Republic', iso: 'CF', flag: '🇨🇫' },
  { code: '+235', name: 'Chad', iso: 'TD', flag: '🇹🇩' },
  { code: '+56', name: 'Chile', iso: 'CL', flag: '🇨🇱' },
  { code: '+86', name: 'China', iso: 'CN', flag: '🇨🇳' },
  { code: '+57', name: 'Colombia', iso: 'CO', flag: '🇨🇴' },
  { code: '+269', name: 'Comoros', iso: 'KM', flag: '🇰🇲' },
  { code: '+242', name: 'Congo', iso: 'CG', flag: '🇨🇬' },
  { code: '+506', name: 'Costa Rica', iso: 'CR', flag: '🇨🇷' },
  { code: '+385', name: 'Croatia', iso: 'HR', flag: '🇭🇷' },
  { code: '+53', name: 'Cuba', iso: 'CU', flag: '🇨🇺' },
  { code: '+357', name: 'Cyprus', iso: 'CY', flag: '🇨🇾' },
  { code: '+420', name: 'Czech Republic', iso: 'CZ', flag: '🇨🇿' },
  { code: '+45', name: 'Denmark', iso: 'DK', flag: '🇩🇰' },
  { code: '+253', name: 'Djibouti', iso: 'DJ', flag: '🇩🇯' },
  { code: '+593', name: 'Ecuador', iso: 'EC', flag: '🇪🇨' },
  { code: '+20', name: 'Egypt', iso: 'EG', flag: '🇪🇬' },
  { code: '+503', name: 'El Salvador', iso: 'SV', flag: '🇸🇻' },
  { code: '+240', name: 'Equatorial Guinea', iso: 'GQ', flag: '🇬🇶' },
  { code: '+291', name: 'Eritrea', iso: 'ER', flag: '🇪🇷' },
  { code: '+372', name: 'Estonia', iso: 'EE', flag: '🇪🇪' },
  { code: '+251', name: 'Ethiopia', iso: 'ET', flag: '🇪🇹' },
  { code: '+358', name: 'Finland', iso: 'FI', flag: '🇫🇮' },
  { code: '+33', name: 'France', iso: 'FR', flag: '🇫🇷' },
  { code: '+241', name: 'Gabon', iso: 'GA', flag: '🇬🇦' },
  { code: '+220', name: 'Gambia', iso: 'GM', flag: '🇬🇲' },
  { code: '+995', name: 'Georgia', iso: 'GE', flag: '🇬🇪' },
  { code: '+49', name: 'Germany', iso: 'DE', flag: '🇩🇪' },
  { code: '+233', name: 'Ghana', iso: 'GH', flag: '🇬🇭' },
  { code: '+30', name: 'Greece', iso: 'GR', flag: '🇬🇷' },
  { code: '+502', name: 'Guatemala', iso: 'GT', flag: '🇬🇹' },
  { code: '+224', name: 'Guinea', iso: 'GN', flag: '🇬🇳' },
  { code: '+245', name: 'Guinea-Bissau', iso: 'GW', flag: '🇬🇼' },
  { code: '+592', name: 'Guyana', iso: 'GY', flag: '🇬🇾' },
  { code: '+509', name: 'Haiti', iso: 'HT', flag: '🇭🇹' },
  { code: '+504', name: 'Honduras', iso: 'HN', flag: '🇭🇳' },
  { code: '+852', name: 'Hong Kong', iso: 'HK', flag: '🇭🇰' },
  { code: '+36', name: 'Hungary', iso: 'HU', flag: '🇭🇺' },
  { code: '+354', name: 'Iceland', iso: 'IS', flag: '🇮🇸' },
  { code: '+91', name: 'India', iso: 'IN', flag: '🇮🇳' },
  { code: '+62', name: 'Indonesia', iso: 'ID', flag: '🇮🇩' },
  { code: '+98', name: 'Iran', iso: 'IR', flag: '🇮🇷' },
  { code: '+964', name: 'Iraq', iso: 'IQ', flag: '🇮🇶' },
  { code: '+353', name: 'Ireland', iso: 'IE', flag: '🇮🇪' },
  { code: '+972', name: 'Israel', iso: 'IL', flag: '🇮🇱' },
  { code: '+39', name: 'Italy', iso: 'IT', flag: '🇮🇹' },
  { code: '+225', name: 'Ivory Coast', iso: 'CI', flag: '🇨🇮' },
  { code: '+81', name: 'Japan', iso: 'JP', flag: '🇯🇵' },
  { code: '+962', name: 'Jordan', iso: 'JO', flag: '🇯🇴' },
  { code: '+7', name: 'Kazakhstan', iso: 'KZ', flag: '🇰🇿' },
  { code: '+254', name: 'Kenya', iso: 'KE', flag: '🇰🇪' },
  { code: '+965', name: 'Kuwait', iso: 'KW', flag: '🇰🇼' },
  { code: '+996', name: 'Kyrgyzstan', iso: 'KG', flag: '🇰🇬' },
  { code: '+856', name: 'Laos', iso: 'LA', flag: '🇱🇦' },
  { code: '+371', name: 'Latvia', iso: 'LV', flag: '🇱🇻' },
  { code: '+961', name: 'Lebanon', iso: 'LB', flag: '🇱🇧' },
  { code: '+266', name: 'Lesotho', iso: 'LS', flag: '🇱🇸' },
  { code: '+231', name: 'Liberia', iso: 'LR', flag: '🇱🇷' },
  { code: '+218', name: 'Libya', iso: 'LY', flag: '🇱🇾' },
  { code: '+423', name: 'Liechtenstein', iso: 'LI', flag: '🇱🇮' },
  { code: '+370', name: 'Lithuania', iso: 'LT', flag: '🇱🇹' },
  { code: '+352', name: 'Luxembourg', iso: 'LU', flag: '🇱🇺' },
  { code: '+853', name: 'Macau', iso: 'MO', flag: '🇲🇴' },
  { code: '+389', name: 'Macedonia', iso: 'MK', flag: '🇲🇰' },
  { code: '+261', name: 'Madagascar', iso: 'MG', flag: '🇲🇬' },
  { code: '+265', name: 'Malawi', iso: 'MW', flag: '🇲🇼' },
  { code: '+60', name: 'Malaysia', iso: 'MY', flag: '🇲🇾' },
  { code: '+960', name: 'Maldives', iso: 'MV', flag: '🇲🇻' },
  { code: '+223', name: 'Mali', iso: 'ML', flag: '🇲🇱' },
  { code: '+356', name: 'Malta', iso: 'MT', flag: '🇲🇹' },
  { code: '+222', name: 'Mauritania', iso: 'MR', flag: '🇲🇷' },
  { code: '+230', name: 'Mauritius', iso: 'MU', flag: '🇲🇺' },
  { code: '+52', name: 'Mexico', iso: 'MX', flag: '🇲🇽' },
  { code: '+373', name: 'Moldova', iso: 'MD', flag: '🇲🇩' },
  { code: '+377', name: 'Monaco', iso: 'MC', flag: '🇲🇨' },
  { code: '+976', name: 'Mongolia', iso: 'MN', flag: '🇲🇳' },
  { code: '+382', name: 'Montenegro', iso: 'ME', flag: '🇲🇪' },
  { code: '+212', name: 'Morocco', iso: 'MA', flag: '🇲🇦' },
  { code: '+258', name: 'Mozambique', iso: 'MZ', flag: '🇲🇿' },
  { code: '+95', name: 'Myanmar', iso: 'MM', flag: '🇲🇲' },
  { code: '+264', name: 'Namibia', iso: 'NA', flag: '🇳🇦' },
  { code: '+977', name: 'Nepal', iso: 'NP', flag: '🇳🇵' },
  { code: '+31', name: 'Netherlands', iso: 'NL', flag: '🇳🇱' },
  { code: '+64', name: 'New Zealand', iso: 'NZ', flag: '🇳🇿' },
  { code: '+505', name: 'Nicaragua', iso: 'NI', flag: '🇳🇮' },
  { code: '+227', name: 'Niger', iso: 'NE', flag: '🇳🇪' },
  { code: '+234', name: 'Nigeria', iso: 'NG', flag: '🇳🇬' },
  { code: '+850', name: 'North Korea', iso: 'KP', flag: '🇰🇵' },
  { code: '+47', name: 'Norway', iso: 'NO', flag: '🇳🇴' },
  { code: '+968', name: 'Oman', iso: 'OM', flag: '🇴🇲' },
  { code: '+92', name: 'Pakistan', iso: 'PK', flag: '🇵🇰' },
  { code: '+970', name: 'Palestine', iso: 'PS', flag: '🇵🇸' },
  { code: '+507', name: 'Panama', iso: 'PA', flag: '🇵🇦' },
  { code: '+675', name: 'Papua New Guinea', iso: 'PG', flag: '🇵🇬' },
  { code: '+595', name: 'Paraguay', iso: 'PY', flag: '🇵🇾' },
  { code: '+51', name: 'Peru', iso: 'PE', flag: '🇵🇪' },
  { code: '+63', name: 'Philippines', iso: 'PH', flag: '🇵🇭' },
  { code: '+48', name: 'Poland', iso: 'PL', flag: '🇵🇱' },
  { code: '+351', name: 'Portugal', iso: 'PT', flag: '🇵🇹' },
  { code: '+974', name: 'Qatar', iso: 'QA', flag: '🇶🇦' },
  { code: '+40', name: 'Romania', iso: 'RO', flag: '🇷🇴' },
  { code: '+7', name: 'Russia', iso: 'RU', flag: '🇷🇺' },
  { code: '+250', name: 'Rwanda', iso: 'RW', flag: '🇷🇼' },
  { code: '+966', name: 'Saudi Arabia', iso: 'SA', flag: '🇸🇦' },
  { code: '+221', name: 'Senegal', iso: 'SN', flag: '🇸🇳' },
  { code: '+381', name: 'Serbia', iso: 'RS', flag: '🇷🇸' },
  { code: '+248', name: 'Seychelles', iso: 'SC', flag: '🇸🇨' },
  { code: '+232', name: 'Sierra Leone', iso: 'SL', flag: '🇸🇱' },
  { code: '+65', name: 'Singapore', iso: 'SG', flag: '🇸🇬' },
  { code: '+421', name: 'Slovakia', iso: 'SK', flag: '🇸🇰' },
  { code: '+386', name: 'Slovenia', iso: 'SI', flag: '🇸🇮' },
  { code: '+252', name: 'Somalia', iso: 'SO', flag: '🇸🇴' },
  { code: '+27', name: 'South Africa', iso: 'ZA', flag: '🇿🇦' },
  { code: '+82', name: 'South Korea', iso: 'KR', flag: '🇰🇷' },
  { code: '+211', name: 'South Sudan', iso: 'SS', flag: '🇸🇸' },
  { code: '+34', name: 'Spain', iso: 'ES', flag: '🇪🇸' },
  { code: '+94', name: 'Sri Lanka', iso: 'LK', flag: '🇱🇰' },
  { code: '+249', name: 'Sudan', iso: 'SD', flag: '🇸🇩' },
  { code: '+597', name: 'Suriname', iso: 'SR', flag: '🇸🇷' },
  { code: '+268', name: 'Swaziland', iso: 'SZ', flag: '🇸🇿' },
  { code: '+46', name: 'Sweden', iso: 'SE', flag: '🇸🇪' },
  { code: '+41', name: 'Switzerland', iso: 'CH', flag: '🇨🇭' },
  { code: '+963', name: 'Syria', iso: 'SY', flag: '🇸🇾' },
  { code: '+886', name: 'Taiwan', iso: 'TW', flag: '🇹🇼' },
  { code: '+992', name: 'Tajikistan', iso: 'TJ', flag: '🇹🇯' },
  { code: '+255', name: 'Tanzania', iso: 'TZ', flag: '🇹🇿' },
  { code: '+66', name: 'Thailand', iso: 'TH', flag: '🇹🇭' },
  { code: '+228', name: 'Togo', iso: 'TG', flag: '🇹🇬' },
  { code: '+216', name: 'Tunisia', iso: 'TN', flag: '🇹🇳' },
  { code: '+90', name: 'Turkey', iso: 'TR', flag: '🇹🇷' },
  { code: '+993', name: 'Turkmenistan', iso: 'TM', flag: '🇹🇲' },
  { code: '+256', name: 'Uganda', iso: 'UG', flag: '🇺🇬' },
  { code: '+380', name: 'Ukraine', iso: 'UA', flag: '🇺🇦' },
  { code: '+971', name: 'United Arab Emirates', iso: 'AE', flag: '🇦🇪' },
  { code: '+44', name: 'United Kingdom', iso: 'GB', flag: '🇬🇧' },
  { code: '+1', name: 'United States', iso: 'US', flag: '🇺🇸' },
  { code: '+598', name: 'Uruguay', iso: 'UY', flag: '🇺🇾' },
  { code: '+998', name: 'Uzbekistan', iso: 'UZ', flag: '🇺🇿' },
  { code: '+58', name: 'Venezuela', iso: 'VE', flag: '🇻🇪' },
  { code: '+84', name: 'Vietnam', iso: 'VN', flag: '🇻🇳' },
  { code: '+967', name: 'Yemen', iso: 'YE', flag: '🇾🇪' },
  { code: '+260', name: 'Zambia', iso: 'ZM', flag: '🇿🇲' },
  { code: '+263', name: 'Zimbabwe', iso: 'ZW', flag: '🇿🇼' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    zipCode: '',
    countryCode: '+1',
    telephone: '',
    message: '',
    ownHome: 'yes',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      zipCode: '',
      countryCode: '+1',
      telephone: '',
      message: '',
      ownHome: 'yes'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-screen min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/petr-machacek-BeVGrXEktIk-unsplash.jpg"
          alt="Solar installation"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Contact Us Heading - Left Side on Background */}
      <div className="hidden md:block absolute left-10 lg:left-20 top-1/2 -translate-y-1/2 max-w-xl">
        <h1 className="text-7xl lg:text-8xl xl:text-9xl text-white font-bold mb-md">Contact Us</h1>
        <p className="text-xl lg:text-2xl text-white/90 font-light">Have questions about solar? We're here to help.</p>
      </div>

      {/* Contact Form Overlay - Right Side */}
      <div className="relative min-h-screen flex items-center justify-center md:justify-end p-sm md:p-lg">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-lg md:p-xl mr-0 md:mr-xl">
            {submitted && (
              <div className="bg-success bg-opacity-10 border border-success text-success p-md mb-lg rounded">
                <p className="font-medium">Thank you for your message. We'll get back to you soon!</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-md">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded"
                  placeholder="First Name"
                />
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded"
                placeholder="Email"
              />
            </div>

            {/* Address */}
            <div>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded"
                placeholder="Address"
              />
            </div>

            {/* Zip Code */}
            <div>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded"
                placeholder="Zip Code"
              />
            </div>

            {/* Telephone with Country Code */}
            <div className="flex gap-sm">
              <div className="relative">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  aria-label="Country code"
                  className="w-56 px-sm py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded appearance-none pr-8 font-semibold cursor-pointer text-base"
                >
                  {COUNTRY_CODES.map((country) => (
                    <option key={`${country.iso}-${country.code}`} value={country.code} className="text-base font-medium">
                      {country.name} {country.code}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                className="flex-1 px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded"
                placeholder="Telephone"
              />
            </div>

            {/* Message */}
            <div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none transition-colors rounded resize-y"
                placeholder="Your message or inquiry..."
              />
            </div>

            {/* Do you own your own home? */}
            <div>
              <p className="text-body text-text-primary mb-sm">Do you own your own home?</p>
              <div className="flex gap-lg">
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="radio"
                    name="ownHome"
                    value="yes"
                    checked={formData.ownHome === 'yes'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-body text-text-primary">Yes</span>
                </label>
                <label className="flex items-center gap-sm cursor-pointer">
                  <input
                    type="radio"
                    name="ownHome"
                    value="no"
                    checked={formData.ownHome === 'no'}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-body text-text-primary">No</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-surface py-md min-h-touch font-medium hover:bg-primary-dark transition-colors rounded"
            >
              Submit
            </button>

            {/* Privacy Notice */}
            <p className="text-caption text-text-secondary text-center">
              We use cookies on this site to enhance your experience. By continuing to use this website, you consent to TRXSolar's usage of cookies, in accordance with our Privacy Policy.
            </p>
          </form>

          {/* CTA Section */}
          <div className="mt-2xl bg-primary/10 border border-primary/20 rounded-lg p-xl text-center">
            <h3 className="text-h3 text-text-primary font-medium mb-sm">Ready to Go Solar?</h3>
            <p className="text-body text-text-secondary mb-lg max-w-2xl mx-auto">
              Skip the wait and get a personalized solar quote instantly. Our quick form takes less than 3 minutes to complete.
            </p>
            <a
              href="/quote"
              className="inline-block bg-primary text-surface px-xl py-md min-h-touch font-medium hover:bg-primary-dark transition-colors shadow-md rounded"
            >
              Get Your Free Quote
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
