'use client';

import { useState } from 'react';
import { useToast } from '@/components/contexts/ToastContext';

// Reuse country codes (abbreviated list)
const COUNTRY_CODES = [
  { code: '+93', name: 'Afghanistan', iso: 'AF' },
  { code: '+355', name: 'Albania', iso: 'AL' },
  { code: '+213', name: 'Algeria', iso: 'DZ' },
  { code: '+1', name: 'Canada', iso: 'CA' },
  { code: '+86', name: 'China', iso: 'CN' },
  { code: '+20', name: 'Egypt', iso: 'EG' },
  { code: '+33', name: 'France', iso: 'FR' },
  { code: '+49', name: 'Germany', iso: 'DE' },
  { code: '+91', name: 'India', iso: 'IN' },
  { code: '+234', name: 'Nigeria', iso: 'NG' },
  { code: '+44', name: 'United Kingdom', iso: 'GB' },
  { code: '+1', name: 'United States', iso: 'US' },
  // Add more as needed
];

interface GeneralInquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  message: string;
}

export default function GeneralInquiryForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<GeneralInquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+234',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GeneralInquiryFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof GeneralInquiryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GeneralInquiryFormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (!formData.message.trim()) newErrors.message = 'Please enter your message';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        message: formData.message
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
      }

      // Show success toast
      showToast({
        type: 'success',
        message: "Thank you for your message. We'll get back to you soon!"
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        countryCode: '+234',
        message: '',
      });
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-lg md:p-xl shadow-md">
        <div className="space-y-lg">
          {/* Full Name */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              className={`w-full px-md py-sm border rounded focus:outline-none focus:border-primary ${
                errors.fullName ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-caption text-error mt-xs">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Email Address <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className={`w-full px-md py-sm border rounded focus:outline-none focus:border-primary ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-caption text-error mt-xs">{errors.email}</p>}
          </div>

          {/* Phone with Country Code */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Phone Number <span className="text-primary">*</span>
            </label>
            <div className="flex gap-sm">
              <select
                value={formData.countryCode}
                onChange={(e) => updateFormData('countryCode', e.target.value)}
                aria-label="Country code"
                className="w-40 px-sm py-sm border border-border rounded focus:border-primary focus:outline-none"
              >
                {COUNTRY_CODES.map((country) => (
                  <option key={`${country.iso}-${country.code}`} value={country.code}>
                    {country.name} {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className={`flex-1 px-md py-sm border rounded focus:outline-none focus:border-primary ${
                  errors.phone ? 'border-error' : 'border-border'
                }`}
                placeholder="Phone number"
              />
            </div>
            {errors.phone && <p className="text-caption text-error mt-xs">{errors.phone}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Your Message <span className="text-primary">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => updateFormData('message', e.target.value)}
              rows={6}
              className={`w-full px-md py-sm border rounded focus:outline-none focus:border-primary resize-y ${
                errors.message ? 'border-error' : 'border-border'
              }`}
              placeholder="How can we help you?"
            />
            {errors.message && <p className="text-caption text-error mt-xs">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-surface py-md min-h-touch font-medium hover:bg-primary-dark transition-colors rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}
