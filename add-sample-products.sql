-- Add 5 sample products for pagination testing
-- Run this in your Neon SQL Editor

INSERT INTO products (id, name, brand, description, price, image, category, specs, featured, media)
VALUES
(
  'SP-SAMPLE-001',
  '600W Bifacial Solar Panel',
  'Trina Solar',
  'Advanced bifacial technology captures light from both sides for maximum energy output. Perfect for ground-mounted systems.',
  525.00,
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
  'solar-panels',
  '{"wattage": "600", "efficiency": "21.8%", "voltage": "42.1V", "warranty": "25 years", "dimensions": "2384×1096×35mm", "weight": "32.5kg", "certifications": "IEC, CE, TUV"}'::jsonb,
  false,
  '[]'::jsonb
),
(
  'INV-SAMPLE-001',
  '8KW Hybrid Inverter',
  'Growatt',
  'Hybrid solar inverter with battery storage capability. Smart energy management for residential applications.',
  1850.00,
  'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop',
  'inverters',
  '{"wattage": "8000", "efficiency": "97.6%", "voltage": "230V/400V", "warranty": "10 years", "dimensions": "450×570×190mm", "weight": "28kg", "certifications": "IEC, CE, VDE"}'::jsonb,
  true,
  '[]'::jsonb
),
(
  'BAT-SAMPLE-001',
  '10kWh LiFePO4 Battery',
  'BYD',
  'High-capacity lithium iron phosphate battery pack. Long cycle life and safe chemistry for home energy storage.',
  3200.00,
  'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop',
  'batteries',
  '{"capacity": "10kWh", "voltage": "51.2V", "cycles": "6000+", "warranty": "10 years", "dimensions": "670×485×180mm", "weight": "98kg", "certifications": "UN38.3, IEC"}'::jsonb,
  true,
  '[]'::jsonb
),
(
  'SP-SAMPLE-002',
  '450W Half-Cut Panel',
  'Longi',
  'Half-cut cell technology reduces resistive losses and improves performance in partial shade conditions.',
  385.00,
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop',
  'solar-panels',
  '{"wattage": "450", "efficiency": "20.9%", "voltage": "41.8V", "warranty": "25 years", "dimensions": "2094×1038×35mm", "weight": "24.2kg", "certifications": "IEC, CE, TUV"}'::jsonb,
  false,
  '[]'::jsonb
),
(
  'ACC-SAMPLE-001',
  '60A MPPT Charge Controller',
  'Victron Energy',
  'Maximum Power Point Tracking charge controller for optimal solar panel performance and battery charging.',
  485.00,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
  'accessories',
  '{"current": "60A", "voltage": "12/24/48V", "efficiency": "98%", "warranty": "5 years", "dimensions": "215×215×70mm", "weight": "2.5kg", "certifications": "CE, RoHS"}'::jsonb,
  false,
  '[]'::jsonb
);

-- Verify the insert
SELECT id, name, brand, category, price, featured FROM products
WHERE id LIKE '%-SAMPLE-%'
ORDER BY created_at DESC;
