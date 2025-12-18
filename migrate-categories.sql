-- Categories table migration
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

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

INSERT INTO categories (slug, name, description, display_order) VALUES
  ('solar-panels', 'Solar Panels', 'High-efficiency photovoltaic panels for residential and commercial use', 1),
  ('inverters', 'Inverters', 'DC to AC power conversion systems including string, micro, and hybrid inverters', 2),
  ('batteries', 'Solar Batteries', 'Energy storage solutions including lithium-ion and deep cycle batteries', 3),
  ('accessories', 'Charge Controllers', 'Solar system accessories including MPPT and PWM charge controllers', 4)
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_featured_created ON products(category, featured, created_at DESC);
