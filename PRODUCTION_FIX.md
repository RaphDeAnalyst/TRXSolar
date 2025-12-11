# Production Database Fix for vcsolar.shop

## Problem
- Products are visible locally but NOT on live site (vcsolar.shop)
- This indicates a production environment/database issue

## Solution Steps

### Step 1: Check Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your TRXSolar project
3. Go to **Settings** → **Environment Variables**
4. Verify these variables are set for **Production**:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `NEXT_PUBLIC_ADMIN_PASSWORD` (optional, defaults to "solar2024")

**If they're missing:**
- Go to **Storage** tab → Select your Postgres database
- Copy the environment variables
- Add them in Settings → Environment Variables

### Step 2: Update Production Database Schema

The production database is likely missing the `media` column. Run this SQL in your Vercel Postgres Query Editor:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Storage** tab
3. Click on your Postgres database
4. Click **Data** tab → **Query** button
5. Run this SQL:

```sql
-- Step 1: Add media column if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Step 2: Migrate existing single image URLs to new media array (if image column has data)
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
WHERE image IS NOT NULL AND image != '' AND (media IS NULL OR media = '[]'::jsonb);

-- Step 3: Verify the schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Step 4: Check if you have any products
SELECT COUNT(*) as product_count FROM products;

-- Step 5: Show sample products
SELECT id, name, brand, image, media FROM products LIMIT 3;
```

### Step 3: Verify Database Has Products

If the count is 0, you need to add products via the admin panel:

1. Go to https://vcsolar.shop/admin
2. Login with your admin password
3. Go to **Products** tab
4. Click **Add New Product**
5. Fill in all fields and click **Create Product**
6. Verify the product appears in the admin table
7. Visit https://vcsolar.shop/products to verify it appears on the client side

### Step 4: Test the Diagnostic Endpoint

Visit this URL in your browser:
```
https://vcsolar.shop/api/test-products
```

This will show you:
- Database table structure
- Product count
- Sample products
- Environment variable status

Look for any errors in the response.

### Step 5: Redeploy Your Site

After updating the database schema:

1. Go to Vercel Dashboard → Deployments
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete
5. Visit https://vcsolar.shop/products

**OR** via CLI:
```bash
vercel --prod
```

## Verification Checklist

After completing the above steps, verify:

- [ ] Can login to https://vcsolar.shop/admin
- [ ] Can see products in admin panel Products tab
- [ ] Can create a new product in admin panel
- [ ] New product appears in admin products list immediately
- [ ] Visit https://vcsolar.shop/products and see the products
- [ ] Product images display correctly
- [ ] Can click on a product to view details

## Common Issues

### Issue: "Failed to fetch products" in admin panel
**Solution:**
- Check POSTGRES_URL is set in Vercel environment variables
- Redeploy after adding environment variables

### Issue: Products show in admin but not on /products page
**Solution:**
- Check browser console for errors (F12)
- Verify /api/products endpoint works: https://vcsolar.shop/api/products
- Should return JSON with products array

### Issue: Database connection errors
**Solution:**
- Verify Vercel Postgres database is active
- Check environment variables are set for Production (not just Preview)
- Redeploy the application

### Issue: "Column 'media' does not exist" error
**Solution:**
- Run the SQL migration from Step 2 above
- This adds the media column that recent code expects

## Testing the Public API

Open your browser and visit:
```
https://vcsolar.shop/api/products
```

Expected response:
```json
{
  "success": true,
  "products": [
    {
      "id": "product-id",
      "name": "Product Name",
      "brand": "Brand",
      "category": "solar-panels",
      "price": 5000,
      "image": "https://...",
      "description": "...",
      "specs": {},
      "featured": false
    }
  ]
}
```

If you get an error, the database connection or schema is the issue.

## Still Having Issues?

1. Check Vercel deployment logs:
   - Dashboard → Deployments → Click on latest deployment
   - Look for errors in the Function Logs

2. Check browser console:
   - Visit https://vcsolar.shop/products
   - Open Developer Tools (F12)
   - Look for errors in the Console tab
   - Check Network tab for failed API requests

3. Verify database directly:
   - Vercel Dashboard → Storage → Your Postgres DB
   - Data → Query
   - Run: `SELECT * FROM products;`
   - Should show your products

## Need More Help?

If you've followed all steps and still have issues, check:
- The diagnostic endpoint: https://vcsolar.shop/api/test-products
- Vercel function logs for any error messages
- Browser console for JavaScript errors
