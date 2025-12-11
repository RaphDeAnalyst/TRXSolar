// Script to add 5 sample products to the database
const sampleProducts = [
  {
    id: "SP-SAMPLE-001",
    name: "600W Bifacial Solar Panel",
    brand: "Trina Solar",
    category: "solar-panels",
    price: 525,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    description: "Advanced bifacial technology captures light from both sides for maximum energy output. Perfect for ground-mounted systems.",
    specs: {
      wattage: "600",
      efficiency: "21.8%",
      voltage: "42.1V",
      warranty: "25 years",
      dimensions: "2384×1096×35mm",
      weight: "32.5kg",
      certifications: "IEC, CE, TUV"
    },
    featured: false,
    media: []
  },
  {
    id: "INV-SAMPLE-001",
    name: "8KW Hybrid Inverter",
    brand: "Growatt",
    category: "inverters",
    price: 1850,
    image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop",
    description: "Hybrid solar inverter with battery storage capability. Smart energy management for residential applications.",
    specs: {
      wattage: "8000",
      efficiency: "97.6%",
      voltage: "230V/400V",
      warranty: "10 years",
      dimensions: "450×570×190mm",
      weight: "28kg",
      certifications: "IEC, CE, VDE"
    },
    featured: true,
    media: []
  },
  {
    id: "BAT-SAMPLE-001",
    name: "10kWh LiFePO4 Battery",
    brand: "BYD",
    category: "batteries",
    price: 3200,
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop",
    description: "High-capacity lithium iron phosphate battery pack. Long cycle life and safe chemistry for home energy storage.",
    specs: {
      capacity: "10kWh",
      voltage: "51.2V",
      cycles: "6000+",
      warranty: "10 years",
      dimensions: "670×485×180mm",
      weight: "98kg",
      certifications: "UN38.3, IEC"
    },
    featured: true,
    media: []
  },
  {
    id: "SP-SAMPLE-002",
    name: "450W Half-Cut Panel",
    brand: "Longi",
    category: "solar-panels",
    price: 385,
    image: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop",
    description: "Half-cut cell technology reduces resistive losses and improves performance in partial shade conditions.",
    specs: {
      wattage: "450",
      efficiency: "20.9%",
      voltage: "41.8V",
      warranty: "25 years",
      dimensions: "2094×1038×35mm",
      weight: "24.2kg",
      certifications: "IEC, CE, TUV"
    },
    featured: false,
    media: []
  },
  {
    id: "ACC-SAMPLE-001",
    name: "60A MPPT Charge Controller",
    brand: "Victron Energy",
    category: "accessories",
    price: 485,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    description: "Maximum Power Point Tracking charge controller for optimal solar panel performance and battery charging.",
    specs: {
      current: "60A",
      voltage: "12/24/48V",
      efficiency: "98%",
      warranty: "5 years",
      dimensions: "215×215×70mm",
      weight: "2.5kg",
      certifications: "CE, RoHS"
    },
    featured: false,
    media: []
  }
];

async function addProducts() {
  const adminPassword = '*vcsolar*'; // Your admin password from .env.local

  console.log('Adding 5 sample products to database...\n');

  for (const product of sampleProducts) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✓ Added: ${product.name} (${product.category})`);
      } else {
        console.log(`✗ Failed: ${product.name} - ${data.error}`);
      }
    } catch (error) {
      console.log(`✗ Error adding ${product.name}:`, error.message);
    }
  }

  console.log('\n✅ Done! You should now have 14 total products (9 original + 5 new)');
  console.log('Refresh your products page to see pagination in action!');
}

addProducts();
