-- Migration: Add category_code column to categories table
-- Run this SQL in your Neon SQL Editor if you already have the categories table

-- Add category_code column (nullable, unique)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS category_code VARCHAR(4) UNIQUE;

-- Update existing categories with their codes
UPDATE categories SET category_code = 'SP' WHERE slug = 'solar-panels';
UPDATE categories SET category_code = 'INV' WHERE slug = 'inverters';
UPDATE categories SET category_code = 'BAT' WHERE slug = 'batteries';
UPDATE categories SET category_code = 'ACC' WHERE slug = 'accessories';

-- Note: New categories can have NULL category_code (will use algorithmic generation)
-- Or admins can set explicit codes when creating categories
