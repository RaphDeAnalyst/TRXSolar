// Database Models

export interface Product {
  id: string;
  name: string;
  brand?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  specs?: Record<string, any>;
  media?: MediaFile[];
  featured?: boolean;
  created_at: Date;
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

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: Date | string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  email?: string;
  created_at: Date;
}

// API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductsResponse extends ApiResponse {
  products?: Product[];
}

export interface ProductResponse extends ApiResponse {
  product?: Product;
}

export interface ContactsResponse extends ApiResponse {
  contacts?: Contact[];
}

export interface ContactResponse extends ApiResponse {
  contact?: Contact;
}

// Form Data Types

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ProductFormData {
  name: string;
  brand?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: string;
  specs?: Record<string, any>;
  media?: MediaFile[];
  featured?: boolean;
}
