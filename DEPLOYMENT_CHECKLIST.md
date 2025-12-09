# VCSolar Deployment Checklist

## Pre-Deployment Setup

### 1. Vercel Account Setup
- [ ] Create/Login to Vercel account
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Link project: `vercel link`

### 2. Database Setup (Vercel Postgres)
- [ ] Go to Vercel Dashboard → Your Project → Storage tab
- [ ] Click "Create Database" → Select "Postgres"
- [ ] Wait for database provisioning
- [ ] Vercel will auto-populate these environment variables:
  - `POSTGRES_URL`
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_USER`
  - `POSTGRES_HOST`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DATABASE`

### 3. Initialize Database Schema
After database is created, run this SQL in Vercel Postgres dashboard (Data → Query tab):

```sql
-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);

-- Create products table (if needed for future)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  category VARCHAR(100),
  price DECIMAL(10, 2),
  image TEXT,
  description TEXT,
  specs JSONB,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_users table (if needed for future)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Email Service (Resend)
- [x] Resend account created
- [x] Domain verified: vcsolar.shop
- [x] DNS records added (DKIM, SPF)
- [x] API key obtained: `re_RJrxmtn7_9B7zAa8pdWrC2o3R5PNTXfii`
- [ ] Verify domain status in Resend dashboard is "Verified"

### 5. Environment Variables
Set these in Vercel Dashboard → Your Project → Settings → Environment Variables:

**Required:**
```
RESEND_API_KEY=re_RJrxmtn7_9B7zAa8pdWrC2o3R5PNTXfii
ADMIN_PASSWORD=*vcsolar*
```

**Auto-populated by Vercel Postgres (don't set manually):**
```
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

**Notes:**
- Ensure all variables are set for "Production" environment
- Do NOT use `NEXT_PUBLIC_` prefix for sensitive values
- Consider changing `ADMIN_PASSWORD` to a more secure value for production

---

## Pre-Deployment Testing (Local)

### Test Contact Forms
- [ ] Run `npm run dev`
- [ ] Test EstimateForm submission at `/contact` (estimate tab)
- [ ] Test GeneralInquiryForm submission at `/contact` (general inquiry tab)
- [ ] Test Quote form submission at `/quote`
- [ ] Verify success messages appear
- [ ] Check browser console for errors

### Test Admin Panel
- [ ] Navigate to `/admin`
- [ ] Login with password: `*vcsolar*`
- [ ] Verify Products tab loads
- [ ] Switch to Contacts tab
- [ ] Verify contacts appear (if database connected)
- [ ] Test search functionality
- [ ] Test status filter
- [ ] Test status update (if database connected)
- [ ] Test contact deletion (if database connected)

### Verify Email Service
**Important:** You can only fully test emails after deploying, as Resend requires database connection.

After deployment:
- [ ] Submit a test contact form
- [ ] Check sales@vcsolar.shop inbox for notification email
- [ ] Check your test email inbox for confirmation email
- [ ] Verify both emails render correctly

---

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: complete backend integration with Resend and Vercel Postgres"
git push origin main
```

### 2. Deploy to Vercel
**Option A: Via Dashboard (Recommended for first deployment)**
- [ ] Go to https://vercel.com/new
- [ ] Import your GitHub repository
- [ ] Framework Preset: Next.js (auto-detected)
- [ ] Root Directory: `./`
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `.next` (default)
- [ ] Install Command: `npm install` (default)
- [ ] Click "Deploy"

**Option B: Via CLI**
```bash
vercel --prod
```

### 3. Configure Vercel Postgres
- [ ] In Vercel Dashboard, go to Storage tab
- [ ] Create Postgres database (if not already created)
- [ ] Go to Data tab → Query
- [ ] Run the SQL schema from step 3 above
- [ ] Verify tables created successfully

### 4. Verify Deployment
- [ ] Visit your production URL: `https://your-project.vercel.app`
- [ ] Test all contact forms
- [ ] Verify emails are sent to sales@vcsolar.shop
- [ ] Login to admin panel at `/admin`
- [ ] Verify contacts appear in admin dashboard
- [ ] Test status updates and deletions

---

## Post-Deployment Configuration

### Custom Domain (Optional)
- [ ] Go to Vercel Dashboard → Your Project → Settings → Domains
- [ ] Add custom domain: `www.vcsolar.shop` and `vcsolar.shop`
- [ ] Configure DNS records as instructed by Vercel
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Verify SSL certificate is active

### Security Checklist
- [ ] Change `ADMIN_PASSWORD` from default value
- [ ] Verify all API routes use authentication middleware
- [ ] Ensure no sensitive data in client-side code
- [ ] Test that `/api/admin/*` routes require Bearer token
- [ ] Verify CORS settings (Vercel handles this by default)

### Performance Optimization
- [ ] Enable Vercel Analytics (optional)
- [ ] Test page load speeds with Lighthouse
- [ ] Verify images are optimized (Next.js Image component)
- [ ] Check mobile responsiveness on real devices

---

## Monitoring & Maintenance

### Regular Checks
- [ ] Monitor email deliverability in Resend dashboard
- [ ] Check contact submissions in admin panel
- [ ] Review Vercel deployment logs for errors
- [ ] Monitor database usage in Vercel Storage dashboard

### Backup Strategy
- [ ] Set up database backups (Vercel Postgres Pro plan includes automated backups)
- [ ] Export contacts periodically: Use admin panel or SQL query
- [ ] Keep environment variables documented securely

### Error Handling
If emails aren't sending:
1. Check Resend dashboard for failed emails
2. Verify domain verification status
3. Check RESEND_API_KEY is set correctly
4. Review Vercel function logs

If database connection fails:
1. Verify all POSTGRES_* environment variables are set
2. Check database is running in Vercel Storage
3. Review connection pool settings

---

## Current Status

✅ **Completed:**
- Backend integration with Resend email service
- Vercel Postgres database schema defined
- All 3 contact forms connected to API
- Admin panel with contact management UI
- Email notification and confirmation templates
- Environment variables configured locally

⏳ **Pending:**
- Deploy to Vercel
- Initialize production database
- Test email service in production
- Verify end-to-end functionality

---

## Quick Deploy Commands

```bash
# 1. Ensure all changes are committed
git status

# 2. Build locally to verify
npm run build

# 3. Deploy to production
vercel --prod

# 4. After deployment, initialize database:
# - Go to Vercel Dashboard → Storage → Postgres → Data → Query
# - Run the SQL schema from this checklist
```

---

## Support & Documentation

- Vercel Docs: https://vercel.com/docs
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Last Updated:** December 9, 2025
**Project:** VCSolar Next.js Application
**Contact:** sales@vcsolar.shop
