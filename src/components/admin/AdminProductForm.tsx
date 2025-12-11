'use client';

import { useState, useEffect } from 'react';
import { Product, ProductCategory, MediaFile } from '@/lib/types';
import FileUploader from '@/components/FileUploader';

interface AdminProductFormProps {
  product?: Product | null;
  onSubmit: (productData: Partial<Product>) => void;
  onCancel: () => void;
  adminPassword: string;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'solar-panels', label: 'Solar Panels' },
  { value: 'inverters', label: 'Inverters' },
  { value: 'batteries', label: 'Solar Batteries' },
  { value: 'accessories', label: 'Accessories' },
];

export default function AdminProductForm({ product, onSubmit, onCancel, adminPassword }: AdminProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'solar-panels' as ProductCategory,
    price: '',
    image: '',
    description: '',
    shortDescription: '',
    wattage: '',
    voltage: '',
    efficiency: '',
    dimensions: '',
    weight: '',
    certifications: '',
    featured: false,
  });

  const [media, setMedia] = useState<MediaFile[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || 'solar-panels',
        price: product.price?.toString() || '',
        image: product.image || '',
        description: product.description || '',
        shortDescription: product.specs?.description?.toString() || '',
        wattage: product.specs?.wattage?.toString() || product.specs?.capacity?.toString() || '',
        voltage: product.specs?.voltage?.toString() || '',
        efficiency: product.specs?.efficiency?.toString() || '',
        dimensions: product.specs?.dimensions?.toString() || '',
        weight: product.specs?.weight?.toString() || '',
        certifications: product.specs?.certifications?.toString() || '',
        featured: product.featured || false,
      });

      // Load existing media
      if (product.media && product.media.length > 0) {
        setMedia(product.media);
      } else if (product.image) {
        // Fallback: convert single image to media array
        setMedia([{
          url: product.image,
          type: 'image',
          public_id: '',
          thumbnail_url: product.image,
          order: 0,
        }]);
      }
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (media.length === 0) newErrors.media = 'At least one image or video is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const specs: { [key: string]: string | number } = {};
    if (formData.wattage) specs.wattage = formData.wattage;
    if (formData.voltage) specs.voltage = formData.voltage;
    if (formData.efficiency) specs.efficiency = formData.efficiency;
    if (formData.dimensions) specs.dimensions = formData.dimensions;
    if (formData.weight) specs.weight = formData.weight;
    if (formData.certifications) specs.certifications = formData.certifications;
    if (formData.shortDescription) specs.description = formData.shortDescription;

    const productData: Partial<Product> = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      price: parseFloat(formData.price),
      image: media[0]?.url || '', // First media item as primary image (backward compatibility)
      media: media,
      description: formData.description,
      specs,
      featured: formData.featured,
    };

    if (product) {
      productData.id = product.id;
    }

    onSubmit(productData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-md">
      <div className="bg-white rounded-lg max-w-3xl w-full my-lg">
        {/* Header */}
        <div className="px-lg py-md border-b border-border flex items-center justify-between sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-h2 font-display font-semibold text-text-primary">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="w-touch h-touch flex items-center justify-center text-text-secondary hover:text-text-primary rounded-full hover:bg-background transition-colors"
            aria-label="Close form"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-lg py-md space-y-lg max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Info Section */}
          <div className="space-y-md">
            <h3 className="text-h3 font-display font-medium text-text-primary border-b border-border pb-xs">
              Basic Information
            </h3>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-body font-medium text-text-primary mb-xs">
                Product Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-md py-sm border ${
                  errors.name ? 'border-error' : 'border-border'
                } bg-surface focus:border-primary focus:outline-none rounded`}
                placeholder="e.g., Canadian Solar 550W HiKu7"
              />
              {errors.name && <p className="text-caption text-error mt-xs">{errors.name}</p>}
            </div>

            {/* Brand */}
            <div>
              <label htmlFor="brand" className="block text-body font-medium text-text-primary mb-xs">
                Brand <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={`w-full px-md py-sm border ${
                  errors.brand ? 'border-error' : 'border-border'
                } bg-surface focus:border-primary focus:outline-none rounded`}
                placeholder="e.g., Canadian Solar"
              />
              {errors.brand && <p className="text-caption text-error mt-xs">{errors.brand}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-body font-medium text-text-primary mb-xs">
                Category <span className="text-error">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-md">
            <h3 className="text-h3 font-display font-medium text-text-primary border-b border-border pb-xs">
              Pricing
            </h3>

            <div>
              <label htmlFor="price" className="block text-body font-medium text-text-primary mb-xs">
                Price (₦) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-md py-sm border ${
                  errors.price ? 'border-error' : 'border-border'
                } bg-surface focus:border-primary focus:outline-none rounded`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-caption text-error mt-xs">{errors.price}</p>}
            </div>
          </div>

          {/* Technical Specs Section */}
          <div className="space-y-md">
            <h3 className="text-h3 font-display font-medium text-text-primary border-b border-border pb-xs">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div>
                <label htmlFor="wattage" className="block text-body font-medium text-text-primary mb-xs">
                  Wattage/Capacity
                </label>
                <input
                  type="text"
                  id="wattage"
                  name="wattage"
                  value={formData.wattage}
                  onChange={handleChange}
                  className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                  placeholder="e.g., 550W or 5kWh"
                />
              </div>

              <div>
                <label htmlFor="voltage" className="block text-body font-medium text-text-primary mb-xs">
                  Voltage
                </label>
                <input
                  type="text"
                  id="voltage"
                  name="voltage"
                  value={formData.voltage}
                  onChange={handleChange}
                  className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                  placeholder="e.g., 48V DC"
                />
              </div>

              <div>
                <label htmlFor="efficiency" className="block text-body font-medium text-text-primary mb-xs">
                  Efficiency
                </label>
                <input
                  type="text"
                  id="efficiency"
                  name="efficiency"
                  value={formData.efficiency}
                  onChange={handleChange}
                  className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                  placeholder="e.g., 21.5%"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-body font-medium text-text-primary mb-xs">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                  placeholder="e.g., 27.5 kg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dimensions" className="block text-body font-medium text-text-primary mb-xs">
                Dimensions
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                placeholder="e.g., 2278 × 1134 × 35 mm"
              />
            </div>

            <div>
              <label htmlFor="certifications" className="block text-body font-medium text-text-primary mb-xs">
                Certifications
              </label>
              <input
                type="text"
                id="certifications"
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded"
                placeholder="e.g., IEC, CE, TUV"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-md">
            <h3 className="text-h3 font-display font-medium text-text-primary border-b border-border pb-xs">
              Description
            </h3>

            <div>
              <label htmlFor="shortDescription" className="block text-body font-medium text-text-primary mb-xs">
                Short Description
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={2}
                className="w-full px-md py-sm border border-border bg-surface focus:border-primary focus:outline-none rounded resize-none"
                placeholder="Brief description for specs display"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-body font-medium text-text-primary mb-xs">
                Full Description <span className="text-error">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`w-full px-md py-sm border ${
                  errors.description ? 'border-error' : 'border-border'
                } bg-surface focus:border-primary focus:outline-none rounded resize-none`}
                placeholder="Detailed product description"
              />
              {errors.description && <p className="text-caption text-error mt-xs">{errors.description}</p>}
            </div>
          </div>

          {/* Media Section */}
          <div className="space-y-md">
            <h3 className="text-h3 font-display font-medium text-text-primary border-b border-border pb-xs">
              Product Media <span className="text-error">*</span>
            </h3>

            <FileUploader
              value={media}
              onChange={setMedia}
              maxFiles={10}
              adminPassword={adminPassword}
            />
            {errors.media && <p className="text-caption text-error mt-xs">{errors.media}</p>}
            <p className="text-caption text-text-secondary">
              Upload images and videos for this product. The first item will be used as the primary image.
            </p>
          </div>

          {/* Status Section */}
          <div className="space-y-md">
            <h3 className="text-h3 font-display font-medium text-text-primary border-b border-border pb-xs">
              Status
            </h3>

            <div className="flex items-center gap-sm">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary focus:ring-primary border-border rounded"
              />
              <label htmlFor="featured" className="text-body text-text-primary cursor-pointer">
                Mark as Featured Product
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-sm pt-md border-t border-border sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-lg py-sm min-h-touch bg-background text-text-primary font-sans font-semibold rounded hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-lg py-sm min-h-touch bg-primary text-white font-display font-semibold rounded hover:bg-primary-dark transition-colors"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
