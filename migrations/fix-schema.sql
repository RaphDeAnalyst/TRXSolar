-- Migration to align database schema with application code
-- Run this in your Neon SQL Editor if you encounter column name issues

-- Check if products table exists and has old column names, update them
DO $$
BEGIN
  -- Check if image_url column exists and rename to image if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products RENAME COLUMN image_url TO image;
  END IF;

  -- Check if specifications column exists and rename to specs if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'specifications'
  ) THEN
    ALTER TABLE products RENAME COLUMN specifications TO specs;
  END IF;

  -- Add brand column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'brand'
  ) THEN
    ALTER TABLE products ADD COLUMN brand VARCHAR(100);
  END IF;

  -- Add featured column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'featured'
  ) THEN
    ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;
  END IF;

  -- Drop updated_at if it exists (we don't use it in the app)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE products DROP COLUMN updated_at;
  END IF;
END $$;

-- Ensure products table matches the schema from schema.sql
-- This is idempotent and safe to run multiple times
ALTER TABLE products ALTER COLUMN id TYPE VARCHAR(100);
ALTER TABLE products ALTER COLUMN price TYPE DECIMAL(10, 2);
ALTER TABLE products ALTER COLUMN specs TYPE JSONB USING specs::jsonb;

-- Ensure created_at has correct default if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE products ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Display current schema for verification
SELECT
  column_name,
  data_type,
  character_maximum_length,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
