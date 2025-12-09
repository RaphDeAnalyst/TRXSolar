# VCSolar Deployment Guide

This guide covers deploying the VCSolar website to Vercel and managing it in production.

## Table of Contents
1. [Vercel Deployment](#vercel-deployment)
2. [Custom Domain](#custom-domain)
3. [Environment Variables](#environment-variables)
4. [Managing Products](#managing-products)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)

---

## Vercel Deployment

### Prerequisites
- GitHub account (recommended) or Git repository
- Vercel account (free tier available)
- Node.js 18+ and npm 9+

### Option 1: Deploy from GitHub (Recommended)

1. **Push your project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VCSolar website"
   git branch -M main
   git remote add origin https://github.com/yourusername/vcsolar.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Auto-deployment**
   - Every push to `main` automatically deploys
   - Pull requests get preview deployments
   - Rollback by redeploying previous commit

### Option 2: Deploy Using Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd c:\Users\rapha\Desktop\VCSolar
vercel

# For production deployment
vercel --prod
```

### Build Settings in Vercel

**Framework**: Next.js (auto-detected)
**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install --legacy-peer-deps`

No additional configuration needed - Vercel handles Node.js version and optimization automatically.

---

## Custom Domain

### Add Custom Domain to Vercel

1. Go to Vercel Project Settings → Domains
2. Add your domain (e.g., `vcsolar.com`)
3. Choose one of two options:

#### Option A: Use Vercel's Nameservers (Recommended)
- Update your domain registrar to use Vercel's nameservers
- Vercel automatically configures DNS
- Simplest approach

#### Option B: CNAME Record
- Add CNAME record in your domain registrar:
  - Name: `www`
  - Value: `cname.vercel-dns.com`
- Add A record pointing to Vercel's IP
- More control but slightly more complex

### SSL/TLS Certificate
- Vercel automatically provisions free SSL/TLS
- Valid for custom domains
- HTTPS is enforced

---

## Environment Variables

### For Local Development

1. Create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update with your values:
   ```env
   NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
   ```

### For Vercel Production

1. Go to Vercel Project Settings → Environment Variables
2. Add each variable:
   - Name: `NEXT_PUBLIC_ADMIN_PASSWORD`
   - Value: Your secure password
   - Environment: Production, Preview, Development (select as needed)

3. Redeploy after adding variables:
   - Go to Deployments
   - Click three dots on latest deployment
   - Select "Redeploy"

### Secure Passwords Best Practice

Use strong, random passwords for admin access:
```bash
# Generate a secure password using OpenSSL
openssl rand -base64 32
```

Never commit `.env.local` to Git - it's already in `.gitignore`.

---

## Managing Products

### Current Method: JSON-Based

#### Add a New Product

1. **Open** `src/data/products.json`

2. **Add to appropriate category** (example: solar-panels):
   ```json
   {
     "id": "panel-new-001",
     "name": "New 600W Panel",
     "brand": "Suntech",
     "category": "solar-panels",
     "price": 549,
     "image": "/products/panel-new-001.jpg",
     "gallery": ["/products/panel-new-001.jpg"],
     "specs": {
       "wattage": 600,
       "efficiency": "22.8%",
       "voltage": "41.5V",
       "warranty": "25 years"
     },
     "description": "Ultra-high-efficiency 600W panel for premium installations.",
     "featured": true
   }
   ```

3. **Add product image** to `public/products/`
   - Recommended: PNG or JPG, ~500x500px minimum
   - Vercel Image Optimization handles resizing
   - File size can be large - it'll be optimized

4. **Commit and push**:
   ```bash
   git add src/data/products.json public/products/panel-new-001.jpg
   git commit -m "Add 600W solar panel product"
   git push origin main
   ```

5. **Vercel auto-deploys** - new product appears in ~1-2 minutes

#### Update Product Details

1. Open `src/data/products.json`
2. Find the product by ID
3. Update fields (price, specs, description, etc.)
4. Commit and push

#### Remove a Product

1. Delete the product object from `src/data/products.json`
2. Optionally delete image from `public/products/`
3. Commit and push

### Future: Admin Panel

An admin UI is planned to make product management easier:
- Web form to add/edit/delete products
- Image upload without file system access
- Password-protected dashboard
- Preview before publishing

---

## Performance Optimization

### Image Optimization (Automatic)

Vercel Image Optimization automatically:
- Converts to modern formats (WebP, AVIF)
- Resizes for different screen sizes
- Compresses without quality loss
- Caches globally on CDN

**Current status**: Using Vercel's free tier
**Scaling plan**: Migrate to AWS S3 + CloudFront if traffic exceeds 50K monthly image requests

### Static Site Generation (SSG)

All pages are pre-built at deployment:
- Zero runtime computation
- Fastest possible load times
- Served from CDN edge locations
- Perfect for SEO

### Code Splitting

Next.js automatically:
- Splits code per route
- Loads only what's needed
- Lazy-loads components
- Optimizes bundle size

### Caching Strategy

Vercel automatically:
- Caches static assets (images, CSS, JS) for 1 year
- Sets proper Cache-Control headers
- Uses edge caching for HTML
- Serves stale content during rebuilds

### Lighthouse Scores Target

After optimization:
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

Check locally:
```bash
npm run build
npm run start
# Open Chrome DevTools → Lighthouse
```

---

## Monitoring

### Vercel Dashboard

Monitor in your Vercel project:

**Deployments**
- Track build status
- View deployment logs
- See file changes
- Quick access to previous versions

**Analytics** (Pro plan)
- Web Vitals
- Custom metrics
- Usage patterns
- Performance data

**Edge Function Logs** (if added)
- Monitor API routes
- Debug issues
- Track errors

### Web Vitals Monitoring

Add Google Analytics (optional):

```bash
# Add to .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Then create `src/lib/gtag.ts`:
```typescript
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  (window as any).gtag('config', GA_ID, {
    page_path: url,
  });
};
```

### Error Tracking

Vercel automatically logs errors in:
- Function logs (API routes)
- Build logs (compilation errors)
- Edge logs (if using edge middleware)

---

## Troubleshooting

### Deploy Fails with Build Error

1. **Check Node version**: Vercel uses Node 18+ by default
2. **Clear cache**:
   - Vercel Dashboard → Settings → Advanced → Clear Build Cache
   - Redeploy
3. **Check logs**:
   - Vercel Dashboard → Deployments → [Failed] → See full logs
4. **Local reproduction**:
   ```bash
   npm ci  # Clean install
   npm run build
   ```

### Products Not Updating

1. **Verify JSON syntax**: Use VS Code JSON validator
2. **Clear Vercel cache**:
   - Redeploy the current version
   - Or deploy a new commit
3. **Check git**:
   ```bash
   git status  # Ensure changes are committed
   git log -1  # Verify latest commit is on main
   ```

### Images Not Showing

1. **File exists**: Check `public/products/` directory
2. **Correct path**: Verify JSON has correct image path
3. **Filename case**: Linux is case-sensitive (Windows isn't)
4. **Try rebuilding**:
   ```bash
   npm run build
   npm run start
   ```

### Slow Performance

1. **Check image sizes**:
   - Images should be max 2MB
   - Use tools like [TinyPNG](https://tinypng.com)
2. **Monitor Vercel Analytics**:
   - Check Web Vitals
   - Identify slow pages
3. **Rebuild locally**:
   ```bash
   rm -rf .next
   npm run build
   ```

### Admin Panel Not Working

1. **Check password**: Verify in environment variables
2. **Clear browser cache**: Ctrl+Shift+Del
3. **Check logs**: Vercel → Deployments → Function Logs

### Domain Not Working

1. **Verify DNS** (3-48 hours to propagate):
   ```bash
   nslookup yourdomain.com
   ```
2. **Check HTTPS**: Visit https:// version
3. **Vercel DNS settings**: Verify in Vercel dashboard
4. **Registrar settings**: Double-check nameservers or CNAME

---

## Scaling for Growth

### Phase 2: Admin Panel (Est. 200+ products)

When managing products becomes tedious:
- Implement web-based admin form
- API route for product creation
- Image upload handling
- Auto-site regeneration

### Phase 3: AWS S3 Migration (Est. 50K+ monthly image requests)

Current: Vercel Image Optimization
Cost: Included in Vercel Pro (~$20/month)

Migration path:
- Set up AWS S3 bucket
- Configure CloudFront CDN
- Deploy image optimizer Lambda
- Update `next.config.js` loader
- Expected savings: 80% on image costs

### Phase 4: Inventory Management (Est. revenue >$10K/month)

Add real-time inventory:
- Connect to database (Firebase, Supabase)
- Show stock levels
- Auto-hide out-of-stock
- Email alerts for low stock

---

## Summary of Deployment Workflow

```
1. Update products in src/data/products.json
2. Add images to public/products/
3. Commit: git add . && git commit -m "..."
4. Push: git push origin main
5. Vercel auto-deploys (~1-2 minutes)
6. Site updates automatically
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: Create issue in your repo
- **Status Page**: https://www.vercel-status.com

---

**Happy deploying!** 🚀
