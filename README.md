# TRXSolar - Premium Solar Retail Website

A minimalist, high-performance solar retail website built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Features

### Current Implementation (MVP)
- ✅ **Multi-page architecture** with SEO optimization
- ✅ **Product filtering** by category, price, brand, and specifications
- ✅ **Responsive design** optimized for mobile-first experience
- ✅ **Dynamic product pages** with detailed specifications
- ✅ **Static site generation** for maximum performance
- ✅ **Minimalist design** with no animations, gradients, or unnecessary elements
- ✅ **WCAG AA accessibility** compliance
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for rapid, maintainable styling
- ✅ **Next.js Image component** for automatic optimization

### Pages
- **Home** (`/`) - Hero, featured products, category cards, value proposition
- **Products** (`/products`) - Browsable catalog with client-side filtering
- **Product Detail** (`/products/[id]`) - Full specifications, images, related products
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact form
- **FAQ** (`/faq`) - Frequently asked questions with expandable answers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
trxsolar/
├── src/
│   ├── app/
│   │   ├── (pages)
│   │   ├── admin/           # Admin panel (coming soon)
│   │   ├── products/        # Product pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # Reusable React components
│   ├── data/
│   │   └── products.json    # Product data
│   └── lib/
│       └── types.ts         # TypeScript types
├── public/
│   └── products/            # Product images
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── postcss.config.js        # PostCSS configuration
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with SSG, SSR, and API routes |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **React 18** | UI library |
| **Next Image** | Automatic image optimization |
| **Vercel** | Hosting and deployment |

## 📦 Product Data Structure

Products are stored in `/src/data/products.json`:

```json
{
  "solar-panels": [
    {
      "id": "panel-001",
      "name": "400W Monocrystalline Panel",
      "brand": "TRX Solar",
      "category": "solar-panels",
      "price": 299,
      "image": "/products/panel-001.jpg",
      "gallery": ["/products/panel-001.jpg"],
      "specs": {
        "wattage": 400,
        "efficiency": "21.5%",
        "voltage": "40.5V",
        "warranty": "25 years"
      },
      "description": "High-efficiency monocrystalline solar panel...",
      "featured": true
    }
  ]
}
```

### Supported Categories
- `solar-panels` - Solar photovoltaic panels
- `inverters` - DC to AC power inverters
- `batteries` - Energy storage systems
- `accessories` - Installation and management components

## 🎨 Design System

### Colors
- **Primary**: `#007A87` (Teal) - Main brand color
- **Primary Light**: `#00A3B5`
- **Primary Dark**: `#004D57`
- **Surface**: `#FFFFFF` (White)
- **Background**: `#FAFAFA` (Off-white)
- **Text Primary**: `#212121` (Dark Grey)
- **Text Secondary**: `#666666` (Medium Grey)
- **Error**: `#EA4335` (Red)
- **Success**: `#34A853` (Green)

### Typography
- **H1**: 36px (24px mobile) - Bold
- **H2**: 28px (20px mobile) - Medium
- **Body**: 16px - Regular (WCAG minimum)
- **Button**: 14px - Medium/Bold
- **Caption**: 12px - Regular

### Spacing System (8pt Grid)
- `xs`: 8px
- `sm`: 16px
- `md`: 24px
- `lg`: 32px
- `xl`: 48px

### Minimalist Principles
- No gradients (except subtle hero gradient)
- No drop shadows
- No unnecessary borders
- Color used strategically, not decoratively
- Whitespace for visual hierarchy
- Typography for hierarchy (size and weight)
- 48dp minimum touch targets
- Flat, clean design

## 🔄 Adding Products

### Current Method: Edit JSON
1. Open `/src/data/products.json`
2. Add product to appropriate category array
3. Images go to `/public/products/`
4. Deploy (Vercel auto-redeploys on push)

### Example Product Entry
```json
{
  "id": "unique-id-001",
  "name": "Product Name",
  "brand": "Brand Name",
  "category": "solar-panels",
  "price": 299.99,
  "image": "/products/image.jpg",
  "gallery": ["/products/image.jpg"],
  "specs": {
    "specification": "value"
  },
  "description": "Product description...",
  "featured": false
}
```

### Future: Web Admin Panel
An admin panel is coming soon for non-technical product management:
- Password-protected dashboard
- Add/edit/delete products via UI
- Image upload handling
- Auto-regeneration of static pages

## 📱 Responsive Design

The site is optimized for all screen sizes:
- **Mobile**: Single column, drawer-based filters
- **Tablet**: Two column layout
- **Desktop**: Three column grid with sidebar filters
- **Touch targets**: All buttons 48dp minimum

## ♿ Accessibility

WCAG 2.1 AA Compliance:
- ✅ Semantic HTML (proper heading hierarchy)
- ✅ Color contrast 4.5:1 minimum
- ✅ Focus states visible and accessible
- ✅ Alt text on all meaningful images
- ✅ Form labels properly associated
- ✅ Keyboard navigation fully supported
- ✅ Screen reader compatible

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Create `.env.local` for local development:
```env
# Add any future API keys here
```

For Vercel, add variables in Project Settings → Environment Variables.

## 📈 Performance

- **Lighthouse Score Target**: 95+
- **Page Load**: <1s (desktop), <1.5s (mobile 4G)
- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Automatic per-route
- **Caching**: Optimized with Next.js Cache-Control headers

## 🔐 Security

- No user authentication initially (catalog only)
- Admin panel will have password protection (future)
- HTTPS enforced on Vercel
- Secure headers configured
- Input validation on forms

## 📝 Filtering System

Clients can filter products by:
- **Category**: Solar Panels, Inverters, Batteries, Accessories
- **Price Range**: Custom slider (0 - max product price)
- **Brand**: Multi-select checkboxes
- **Specifications**: Product-specific attributes

Filters are URL-based for sharing and bookmarking:
```
/products?category=solar-panels&price=200-500&brands=Brand1,Brand2
```

## 🎯 Next Steps

### Phase 1 (Current)
- ✅ Core website functionality
- ✅ Product catalog
- ✅ Basic filtering
- ⏳ Deploy to Vercel

### Phase 2 (Admin Panel)
- Web-based product management
- Image upload handling
- Product preview before publishing
- Bulk product import

### Phase 3 (Enhanced Features)
- Shopping cart
- Order management
- Customer accounts
- Payment integration
- Product reviews

### Phase 4 (Scaling)
- AWS S3 migration for images
- Sanity CMS integration
- Real-time inventory
- Analytics dashboard

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

Commercial - All rights reserved

## 👤 Support

For questions or issues, please contact the development team.

---

**Built with precision and minimalist design principles** ✨
