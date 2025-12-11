-- Migration: Add support for multiple media files (images and videos)
-- Run this in your Vercel Postgres Query Editor or Neon SQL Editor

-- Step 1: Add new media column (JSONB array) if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate existing single image URLs to new media array
-- Only migrate if media is NULL or empty
UPDATE products
SET media = jsonb_build_array(
  jsonb_build_object(
    'url', image,
    'type', 'image',
    'public_id', NULL,
    'thumbnail_url', image,
    'order', 0
  )
)
WHERE image IS NOT NULL
  AND image != ''
  AND (media IS NULL OR media = '[]'::jsonb);

-- Step 3: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_media ON products USING GIN (media);

-- Step 4: Verify migration - Check schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Step 5: Check product count
SELECT COUNT(*) as total_products FROM products;

-- Step 6: Show sample products with media
SELECT id, name, brand, image, media, featured FROM products LIMIT 5;

-- Note: We keep the old 'image' column for backward compatibility
-- It will be automatically populated from the first media item in application code
