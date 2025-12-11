-- Migration: Add support for multiple media files (images and videos)
-- Run this in your Neon SQL Editor

-- Step 1: Add new media column (JSONB array)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate existing single image URLs to new media array
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
WHERE image IS NOT NULL AND image != '';

-- Step 3: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_media ON products USING GIN (media);

-- Step 4: Verify migration
SELECT id, name, image, media FROM products LIMIT 5;

-- Note: We keep the old 'image' column for backward compatibility
-- It will be automatically populated from the first media item in application code
