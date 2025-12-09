import { Product, ProductCategory } from '../types';

/**
 * Generate brand code from brand name
 * Takes first 3 letters of brand name in uppercase
 */
function generateBrandCode(brand: string): string {
  return brand.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
}

/**
 * Generate category code from category
 */
function generateCategoryCode(category: ProductCategory): string {
  const categoryMap: Record<ProductCategory, string> = {
    'solar-panels': 'SP',
    'inverters': 'INV',
    'batteries': 'BAT',
    'accessories': 'ACC',
  };
  return categoryMap[category];
}

/**
 * Extract wattage/capacity from specs
 */
function extractCapacity(specs: { [key: string]: string | number }): string {
  // Check for wattage first
  if (specs.wattage) {
    const wattage = specs.wattage.toString();
    // Extract numeric value from strings like "550W" or "550"
    const match = wattage.match(/\d+/);
    return match ? match[0] : '000';
  }

  // Check for capacity (for batteries)
  if (specs.capacity) {
    const capacity = specs.capacity.toString();
    const match = capacity.match(/\d+/);
    return match ? match[0] : '000';
  }

  return '000';
}

/**
 * Generate next sequential unique ID for a brand/category combination
 */
function generateUniqueId(existingProducts: Product[], brand: string, category: ProductCategory): string {
  // Filter products by brand and category
  const sameBrandCategoryProducts = existingProducts.filter(
    (p) => p.brand === brand && p.category === category
  );

  // Extract existing IDs and find the highest number
  const existingIds = sameBrandCategoryProducts
    .map((p) => {
      if (!p.id) return 0;
      // Extract the last segment which should be the unique ID
      const parts = p.id.split('-');
      const lastPart = parts[parts.length - 1];
      return parseInt(lastPart, 10) || 0;
    })
    .filter((id) => !isNaN(id));

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const nextId = maxId + 1;

  // Format as 3-digit number with leading zeros
  return nextId.toString().padStart(3, '0');
}

/**
 * Generate SKU for a product
 * Format: [Brand Code]-[Category Code]-[Wattage/Capacity]-[Unique ID]
 * Example: CAN-SP-550-001
 */
export function generateSKU(
  product: Partial<Product>,
  existingProducts: Product[]
): string {
  if (!product.brand || !product.category) {
    throw new Error('Brand and category are required to generate SKU');
  }

  const brandCode = generateBrandCode(product.brand);
  const categoryCode = generateCategoryCode(product.category);
  const capacity = product.specs ? extractCapacity(product.specs) : '000';
  const uniqueId = generateUniqueId(existingProducts, product.brand, product.category);

  return `${brandCode}-${categoryCode}-${capacity}-${uniqueId}`;
}

/**
 * Validate SKU format
 */
export function validateSKU(sku: string): boolean {
  // Format: XXX-XXX-XXX-XXX (Brand-Category-Capacity-ID)
  const skuPattern = /^[A-Z]{2,3}-[A-Z]{2,3}-\d{1,4}-\d{3}$/;
  return skuPattern.test(sku);
}

/**
 * Check if SKU already exists
 */
export function skuExists(sku: string, existingProducts: Product[]): boolean {
  return existingProducts.some((p) => p.id === sku);
}
