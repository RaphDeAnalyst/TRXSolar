'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/contexts/ToastContext';

type FormData = {
  projectType: 'residential' | 'commercial' | 'off-grid' | '';
  timeframe: string;
  address: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
};

export default function QuotePage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    timeframe: '',
    address: '',
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.projectType) newErrors.projectType = 'Please select a project type';
    if (!formData.timeframe) newErrors.timeframe = 'Please select your timeframe';
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

    // Show summary modal for review
    setShowSummary(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        projectType: formData.projectType,
        timeframe: formData.timeframe,
        address: formData.address,
        notes: formData.notes
      };

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      // Close modal
      setShowSummary(false);

      // Show success message
      showToast({
        type: 'success',
        message: 'Thank you! Your quote request has been submitted. We will contact you shortly.',
        duration: 6000
      });

      // Reset form
      setFormData({
        projectType: '',
        timeframe: '',
        address: '',
        fullName: '',
        email: '',
        phone: '',
        notes: '',
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-sm py-lg">
        {/* Header */}
        <div className="text-center mb-2xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-text-primary font-bold mb-md">Get Your Free Solar Quote</h1>
          <p className="text-body text-text-secondary">
            Complete this quick form to receive a personalized solar energy quote tailored to your needs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-xl shadow-md">
          <div className="space-y-6">
            {/* Project Type */}
            <div>
              <label className="block text-body text-text-primary font-medium mb-sm">
                Project Type <span className="text-primary">*</span>
              </label>
              <div className="space-y-sm">
                {['residential', 'commercial', 'off-grid'].map((type) => (
                  <label key={type} className="flex items-center gap-sm cursor-pointer">
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
              {errors.projectType && <p className="text-caption text-red-500 mt-xs">{errors.projectType}</p>}
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-body text-text-primary font-medium mb-sm">
                Installation Timeframe <span className="text-primary">*</span>
              </label>
              <select
                value={formData.timeframe}
                onChange={(e) => updateFormData('timeframe', e.target.value)}
                className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary"
                aria-label="Installation timeframe"
              >
                <option value="">Select timeframe</option>
                <option value="Within 3 Months">Within 3 Months</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="Just Researching">Just Researching</option>
              </select>
              {errors.timeframe && <p className="text-caption text-red-500 mt-xs">{errors.timeframe}</p>}
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-lg">
              <h3 className="text-body font-medium text-text-primary mb-lg">Contact Information</h3>
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
                className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-caption text-red-500 mt-xs">{errors.fullName}</p>}
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
                className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary"
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-caption text-red-500 mt-xs">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-body text-text-primary font-medium mb-sm">
                Phone Number <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary"
                placeholder="+234 XXX XXX XXXX"
              />
              {errors.phone && <p className="text-caption text-red-500 mt-xs">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-body text-text-primary font-medium mb-sm">
                Installation Address <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary"
                placeholder="Enter your full address"
              />
              {errors.address && <p className="text-caption text-red-500 mt-xs">{errors.address}</p>}
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-lg">
              <h3 className="text-body font-medium text-text-primary mb-lg">Additional Information</h3>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-body text-text-primary font-medium mb-sm">
                Additional Notes or Requirements
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateFormData('notes', e.target.value)}
                rows={4}
                className="w-full px-md py-sm border border-border rounded focus:outline-none focus:border-primary resize-none"
                placeholder="Tell us about battery storage needs, EV charger integration, or any other specific requirements..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-3 pt-lg border-t border-border">
              <Link
                href="/"
                className="text-center md:text-left px-lg py-sm text-body text-text-secondary hover:text-text-primary transition-colors min-h-touch flex items-center justify-center md:justify-start"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="w-full md:w-auto md:max-w-md px-xl py-md min-h-touch bg-primary text-surface font-medium hover:bg-primary-dark transition-colors rounded shadow-md"
              >
                Get My Free Quote
              </button>
            </div>
          </div>
        </form>

        {/* Summary Modal */}
        {showSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-sm bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-primary text-surface p-lg border-b border-primary-dark">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">Review Your Quote Request</h2>
                <p className="text-body mt-xs opacity-90">Please verify your information before submitting</p>
              </div>

              {/* Modal Content */}
              <div className="p-lg space-y-lg">
                {/* Project Information */}
                <div>
                  <h3 className="text-body font-bold text-primary mb-md border-b border-border pb-xs">
                    Project Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Project Type</p>
                      <p className="text-body text-text-primary font-medium capitalize">{formData.projectType}</p>
                    </div>
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Installation Timeframe</p>
                      <p className="text-body text-text-primary font-medium">{formData.timeframe}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-body font-bold text-primary mb-md border-b border-border pb-xs">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Full Name</p>
                      <p className="text-body text-text-primary font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Email Address</p>
                      <p className="text-body text-text-primary font-medium break-all">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Phone Number</p>
                      <p className="text-body text-text-primary font-medium">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Installation Address</p>
                      <p className="text-body text-text-primary font-medium">{formData.address}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {formData.notes && (
                  <div>
                    <h3 className="text-body font-bold text-primary mb-md border-b border-border pb-xs">
                      Additional Information
                    </h3>
                    <div>
                      <p className="text-caption text-text-secondary mb-xs">Notes & Requirements</p>
                      <p className="text-body text-text-primary whitespace-pre-wrap">{formData.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-background border-t border-border p-lg">
                {submitError && (
                  <div className="bg-error/10 border border-error text-error p-md mb-md rounded">
                    <p className="font-medium">{submitError}</p>
                  </div>
                )}
                <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-3 max-w-2xl mx-auto">
                  <button
                    type="button"
                    onClick={() => setShowSummary(false)}
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-lg py-md text-body text-text-secondary hover:text-text-primary hover:bg-border transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed min-h-touch"
                  >
                    Go Back & Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                    className="w-full md:w-auto md:max-w-md px-xl py-md min-h-touch bg-primary text-surface font-medium hover:bg-primary-dark transition-colors rounded shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit Quote Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
