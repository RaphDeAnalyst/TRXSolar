-- VCSolar Database Schema
-- Run this in your Neon SQL Editor to initialize your database

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Create index on created_at  for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  category_code VARCHAR(4) UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER categories_updated_at_trigger
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Seed with existing 4 categories
INSERT INTO categories (slug, name, description, category_code, display_order) VALUES
  ('solar-panels', 'Solar Panels', 'High-efficiency photovoltaic panels for residential and commercial use', 'SP', 1),
  ('inverters', 'Inverters', 'DC to AC power conversion systems including string, micro, and hybrid inverters', 'INV', 2),
  ('batteries', 'Solar Batteries', 'Energy storage solutions including lithium-ion and deep cycle batteries', 'BAT', 3),
  ('accessories', 'Charge Controllers', 'Solar system accessories including MPPT and PWM charge controllers', 'ACC', 4)
ON CONFLICT (slug) DO NOTHING;

-- Create products table (if needed for future)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  image TEXT,
  description TEXT,
  specs JSONB,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for category filtering on products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Add composite index for common query pattern (category + featured + sorting)
CREATE INDEX IF NOT EXISTS idx_products_category_featured_created
  ON products(category, featured, created_at DESC);

-- Create admin_users table (if needed for future)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
