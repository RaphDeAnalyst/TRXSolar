# Quick Production Verification Guide

## Step-by-Step Checklist

Follow these steps **in order** to diagnose and fix your production issue:

### ✅ Step 1: Test Database Diagnostic Endpoint (2 minutes)

Visit this URL in your browser:
```
https://vcsolar.shop/api/test-products
```

**Expected Result:**
- JSON response showing database structure
- Product count
- Sample products
- Environment variable status

**If you see an error:**
- Go to Step 2 (check environment variables)

**If you see success with 0 products:**
- Your database is working but empty
- Go to Step 4 (add products via admin)

### ✅ Step 2: Verify Environment Variables (3 minutes)

1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **TRXSolar** project
3. Go to **Settings** tab
4. Click **Environment Variables**
5. Check that these exist for **Production**:
   - `POSTGRES_URL` ✓
   - `POSTGRES_PRISMA_URL` ✓
   - `POSTGRES_URL_NON_POOLING` ✓

**If missing:**
1. Go to **Storage** tab
2. Click your Postgres database
3. Click **Connect** → **Environment Variables**
4. Copy the variables
5. Add them in **Settings** → **Environment Variables**
6. **IMPORTANT:** Select "Production" environment
7. Click **Save**
8. Go to **Deployments** → Click **Redeploy** on latest deployment

### ✅ Step 3: Update Database Schema (5 minutes)

Your production database is likely missing the `media` column.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Storage** tab
4. Click your Postgres database
5. Click **Data** tab
6. Click **Query** button
7. Copy and paste this SQL:

```sql
-- Add media column
ALTER TABLE products
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Verify schema
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Check products
SELECT COUNT(*) as count FROM products;
SELECT * FROM products LIMIT 3;
```

8. Click **Run Query**
9. Check the results - you should see the `media` column listed

### ✅ Step 4: Test Public Products API (1 minute)

Visit this URL in your browser:
```
https://vcsolar.shop/api/products
```

**Expected Result:**
```json
{
  "success": true,
  "products": [...]
}
```

**If you see an error:**
- Database connection issue
- Go back to Step 2

**If products array is empty `[]`:**
- Database is working but has no products
- Continue to Step 5

### ✅ Step 5: Add a Test Product (5 minutes)

1. Visit https://vcsolar.shop/admin
2. Login with your admin password
3. Click **Products** tab
4. Click **Add New Product** button
5. Fill in:
   - **Product Name:** Test Solar Panel
   - **Brand:** Test Brand
   - **Category:** solar-panels
   - **Price:** 5000
   - **Image URL:** https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500
   - **Description:** Test product to verify database connection
6. Click **Create Product**
7. **IMPORTANT:** Look for success message
8. Check if product appears in the admin products table

**If you get an error:**
- Check browser console (F12) for error details
- Go back to Step 2 or 3

**If product appears in admin:**
- Continue to Step 6

### ✅ Step 6: Verify Product on Client Side (1 minute)

1. Open a new tab
2. Visit https://vcsolar.shop/products
3. Look for your "Test Solar Panel" product

**If you see it:**
- ✅ **SUCCESS!** Everything is working
- You can now add your real products via the admin panel

**If you don't see it:**
- Clear browser cache (Ctrl + Shift + R)
- Check browser console for errors (F12)
- Verify API works: https://vcsolar.shop/api/products

### ✅ Step 7: Check Browser Console for Errors (2 minutes)

1. Visit https://vcsolar.shop/products
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for any red errors
5. Click **Network** tab
6. Refresh the page
7. Look for `/api/products` request
8. Click on it to see the response

**Common errors:**
- `Failed to fetch` → Database connection issue (Step 2)
- `500 Internal Server Error` → Database schema issue (Step 3)
- `Column 'media' does not exist` → Run migration (Step 3)

## Quick Troubleshooting

### Issue: "Column 'media' does not exist"
**Solution:** Run the migration SQL from Step 3

### Issue: Environment variables not working
**Solution:**
1. Make sure variables are set for **Production** (not just Preview/Development)
2. Redeploy after adding variables
3. Wait 2-3 minutes for deployment to complete

### Issue: Products show locally but not in production
**Solution:**
- Local and production use different databases
- You need to add products to production database via admin panel at https://vcsolar.shop/admin

### Issue: Can't login to admin panel
**Solution:**
- Default password is "solar2024"
- Or check your `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable

## Expected Timeline

- Steps 1-3: **10 minutes** (one-time setup)
- Steps 4-7: **5 minutes** (verification)
- **Total: ~15 minutes**

After completing these steps, your production site should show database products just like your local development environment.

## What to Do After Success

1. Delete the test product if you don't need it
2. Add your real products via https://vcsolar.shop/admin
3. Verify each product appears on https://vcsolar.shop/products
4. Products will sync instantly between admin and client

## Still Need Help?

If you're still having issues after following all steps:

1. Share the response from https://vcsolar.shop/api/test-products
2. Share any error messages from browser console
3. Share screenshots of Vercel environment variables page (hide sensitive values)
