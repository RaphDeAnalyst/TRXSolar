// Category interface for dynamic category system
export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  category_code: string | null;
  display_order: number;
  product_count?: number;
}

// Updated to string to support dynamic categories
export type ProductCategory = string;

export interface ProductSpecs {
  [key: string]: string | number;
}

export interface MediaFile {
  url: string;
  type: 'image' | 'video';
  public_id: string;
  thumbnail_url?: string;
  order: number;
  width?: number;
  height?: number;
  format?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  image: string;
  gallery?: string[];
  media?: MediaFile[];
  specs: ProductSpecs;
  description: string;
  featured?: boolean;
  createdAt?: string;
}

export interface ProductsData {
  'solar-panels': Product[];
  inverters: Product[];
  batteries: Product[];
  accessories: Product[];
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  brands: string[];
  [key: string]: number | string[];
}
