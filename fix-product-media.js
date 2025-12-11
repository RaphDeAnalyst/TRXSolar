/**
 * Fix Product Media Script
 *
 * This script updates existing products in the database to ensure:
 * 1. Products with image_url but empty media array get the image added to media
 * 2. All products have properly formatted media arrays
 *
 * Run with: node fix-product-media.js
 */

const { sql } = require('@vercel/postgres');

async function fixProductMedia() {
  console.log('🔧 Starting product media fix...\n');

  try {
    // Get all products
    const result = await sql`
      SELECT id, name, image_url, image, media
      FROM products
    `;

    console.log(`Found ${result.rows.length} products to check\n`);

    let fixedCount = 0;

    for (const product of result.rows) {
      const media = typeof product.media === 'string'
        ? JSON.parse(product.media)
        : (product.media || []);

      const imageUrl = product.image_url || product.image;

      // If media is empty but we have an image_url, create media entry
      if (media.length === 0 && imageUrl) {
        const newMedia = [{
          url: imageUrl,
          type: 'image',
          public_id: '', // We don't have this for existing images
          thumbnail_url: imageUrl,
          order: 0
        }];

        await sql`
          UPDATE products
          SET media = ${JSON.stringify(newMedia)}
          WHERE id = ${product.id}
        `;

        console.log(`✅ Fixed: ${product.name}`);
        console.log(`   Added image to media: ${imageUrl}\n`);
        fixedCount++;
      } else if (media.length > 0) {
        console.log(`✓ OK: ${product.name} (already has ${media.length} media items)\n`);
      } else {
        console.log(`⚠️  Warning: ${product.name} has no image or media\n`);
      }
    }

    console.log(`\n🎉 Complete! Fixed ${fixedCount} products`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the fix
fixProductMedia();
