export type ProductCategory = 'solar-panels' | 'inverters' | 'batteries' | 'accessories';

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
