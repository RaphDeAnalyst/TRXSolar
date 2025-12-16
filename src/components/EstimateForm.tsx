'use client';

import { useState } from 'react';
import { useToast } from '@/components/contexts/ToastContext';

// Reuse country codes from contact page
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
  // Add more as needed - abbreviated for brevity
];

interface EstimateFormData {
  projectType: 'residential' | 'commercial' | 'off-grid' | '';
  address: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  timeframe: string;
  notes: string;
}

export default function EstimateForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<EstimateFormData>({
    projectType: '',
    address: '',
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+234',
    timeframe: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EstimateFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof EstimateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EstimateFormData, string>> = {};

    if (!formData.projectType) newErrors.projectType = 'Please select a project type';
    if (!formData.address.trim()) newErrors.address = 'Please enter your installation address';
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';

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
      // Transform form data to API payload format
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        message: `Project Type: ${formData.projectType}\nInstallation Address: ${formData.address}\nTimeframe: ${formData.timeframe || 'Not specified'}\n\nAdditional Notes:\n${formData.notes || 'None'}`
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
        message: "Thank you! We'll prepare your solar estimate and contact you shortly."
      });

      // Reset form
      setFormData({
        projectType: '',
        address: '',
        fullName: '',
        email: '',
        phone: '',
        countryCode: '+234',
        timeframe: '',
        notes: '',
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
        <div className="space-y-6">
          {/* Project Type */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Project Type <span className="text-primary">*</span>
            </label>
            <div className="space-y-sm">
              {['residential', 'commercial', 'off-grid'].map((type) => (
                <label key={type} className="flex items-center gap-sm cursor-pointer min-h-touch">
                  <input
                    type="radio"
                    name="projectType"
                    value={type}
                    checked={formData.projectType === type}
                    onChange={(e) => updateFormData('projectType', e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-body text-text-primary capitalize">{type}</span>
                </label>
              ))}
            </div>
            {errors.projectType && <p className="text-caption text-error mt-xs">{errors.projectType}</p>}
          </div>

          {/* Installation Address */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Installation Address <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              className={`w-full px-md py-3 border rounded focus:outline-none focus:border-primary min-h-[48px] ${
                errors.address ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter your full address"
            />
            {errors.address && <p className="text-caption text-error mt-xs">{errors.address}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              className={`w-full px-md py-3 border rounded focus:outline-none focus:border-primary min-h-[48px] ${
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
              className={`w-full px-md py-3 border rounded focus:outline-none focus:border-primary min-h-[48px] ${
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
            <div className="flex flex-col md:flex-row gap-sm">
              <select
                value={formData.countryCode}
                onChange={(e) => updateFormData('countryCode', e.target.value)}
                aria-label="Country code"
                className="w-full md:w-40 px-sm py-3 border border-border rounded focus:border-primary focus:outline-none min-h-[48px]"
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
                className={`w-full md:flex-1 px-md py-3 border rounded focus:outline-none focus:border-primary min-h-[48px] ${
                  errors.phone ? 'border-error' : 'border-border'
                }`}
                placeholder="Phone number"
              />
            </div>
            {errors.phone && <p className="text-caption text-error mt-xs">{errors.phone}</p>}
          </div>

          {/* Installation Timeframe */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Installation Timeframe
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => updateFormData('timeframe', e.target.value)}
              className="w-full px-md py-3 border border-border rounded focus:outline-none focus:border-primary min-h-[48px]"
              aria-label="Installation timeframe"
            >
              <option value="">Select timeframe</option>
              <option value="Within 3 Months">Within 3 Months</option>
              <option value="3-6 Months">3-6 Months</option>
              <option value="Just Researching">Just Researching</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-body text-text-primary font-medium mb-sm">
              Additional Notes or Requirements
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
              rows={4}
              className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary resize-y"
              placeholder="Battery storage needs, EV charger, or other requirements..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-surface py-md min-h-touch font-medium hover:bg-primary-dark transition-colors rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Get My Free Estimate'}
          </button>
        </div>
      </form>
    </div>
  );
}
