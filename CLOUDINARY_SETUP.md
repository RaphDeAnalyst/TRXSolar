# Cloudinary Image & Video Upload Implementation

This document describes the complete implementation of Cloudinary integration for image and video uploads in the TRXSolar admin panel.

## What's Been Implemented

### 1. Backend Infrastructure
- **Cloudinary SDK Configuration** ([src/lib/cloudinary.ts](src/lib/cloudinary.ts))
  - File validation utilities
  - Image size limit: 5MB
  - Video size limit: 50MB
  - Max 10 files per product
  - Supported formats: JPG, PNG, WEBP, MP4, MOV

- **Upload API Endpoint** ([src/app/api/admin/upload/route.ts](src/app/api/admin/upload/route.ts))
  - POST: Upload multiple files to Cloudinary
  - DELETE: Remove files from Cloudinary
  - Automatic video thumbnail generation
  - Image optimization (1200x1200 max, quality auto)

- **Database Schema Update** ([migrations/add-media-support.sql](migrations/add-media-support.sql))
  - New `media` JSONB column for storing multiple media files
  - Backward compatible with existing `image` column
  - GIN index for efficient JSONB queries

### 2. Frontend Components
- **FileUploader Component** ([src/components/FileUploader.tsx](src/components/FileUploader.tsx))
  - Drag-and-drop file upload
  - Image/video preview grid
  - Reorder files with arrow buttons
  - Delete individual files
  - Upload progress indicator
  - Type badges (image/video)

- **Updated ProductImageGallery** ([src/components/ProductImageGallery.tsx](src/components/ProductImageGallery.tsx))
  - Video playback support
  - Thumbnail generation for videos
  - Lightbox view for images and videos
  - Keyboard navigation
  - Play icons on video thumbnails

### 3. Admin Panel Updates
- **AdminProductForm** ([src/components/admin/AdminProductForm.tsx](src/components/admin/AdminProductForm.tsx))
  - Replaced URL input with FileUploader
  - Media state management
  - Validation for at least one media file

- **API Routes**
  - Updated POST route ([src/app/api/admin/products/route.ts](src/app/api/admin/products/route.ts))
  - Updated PUT route ([src/app/api/admin/products/[id]/route.ts](src/app/api/admin/products/[id]/route.ts))
  - Both routes now handle `media` array

- **Admin Page** ([src/app/admin/page.tsx](src/app/admin/page.tsx))
  - Parse media JSONB from database
  - Pass adminPassword to form

### 4. Client-Side Updates
- **Product Pages**
  - Product listing page ([src/app/products/page.tsx](src/app/products/page.tsx))
  - Product detail page ([src/app/products/[id]/page.tsx](src/app/products/[id]/page.tsx))
  - Both now parse and display media from database

### 5. Configuration
- **Next.js Config** ([next.config.js](next.config.js))
  - Added Cloudinary domain to allowed image sources
  - Increased body size limit to 10MB

## Setup Instructions

### 1. Environment Variables
The following Cloudinary credentials are already in your `.env` file:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ydq7t0dqsd
CLOUDINARY_API_KEY=765144248347856
CLOUDINARY_API_SECRET=kqmMsAREL0dhYpACLUVLk5m2100
```

### 2. Database Migration
**IMPORTANT:** You must run this SQL script in your Neon SQL Editor:

1. Go to your Neon Console: https://console.neon.tech
2. Select your project
3. Click on "SQL Editor"
4. Copy and paste the contents of `migrations/add-media-support.sql`
5. Execute the script

The migration will:
- Add a new `media` JSONB column
- Migrate existing images to the new format
- Create an index for better performance
- Keep the old `image` column for backward compatibility

### 3. Restart Development Server
After running the migration, restart your Next.js development server:
```bash
npm run dev
```

## How to Use

### Adding Products with Media

1. Go to the Admin Panel
2. Click "Add Product"
3. Fill in product details
4. In the "Product Media" section:
   - Click the upload area or drag and drop files
   - Upload up to 10 images and/or videos
   - Images: max 5MB (JPG, PNG, WEBP)
   - Videos: max 50MB (MP4, MOV)
5. Reorder files using the arrow buttons
6. Delete files using the X button
7. Save the product

### Editing Existing Products

1. Click "Edit" on any product
2. Existing media will be loaded automatically
3. Add new files, reorder, or delete as needed
4. Save changes

### Viewing Products

- **Product Listing:** Shows first image/video thumbnail
- **Product Detail:** Interactive gallery with:
  - Main viewer (video controls for videos)
  - Thumbnail grid
  - Lightbox view
  - Keyboard navigation (arrows, Escape)

## Technical Details

### Media Storage Format
Each media item is stored as a JSON object:
```json
{
  "url": "https://res.cloudinary.com/...",
  "type": "image" | "video",
  "public_id": "vcsolar/products/...",
  "thumbnail_url": "https://res.cloudinary.com/...",
  "order": 0,
  "width": 1200,
  "height": 1200,
  "format": "jpg"
}
```

### Backward Compatibility
- Old `image` column is maintained
- Set to first media item URL
- Existing products work without changes
- JSON products still work

### Performance
- Images optimized automatically by Cloudinary
- Videos generate thumbnails for fast preview
- GIN index on media column for fast queries
- Lazy loading for product images

## Files Modified/Created

### Created:
- `src/lib/cloudinary.ts`
- `src/components/FileUploader.tsx`
- `migrations/add-media-support.sql`
- `src/app/api/admin/upload/route.ts`
- `CLOUDINARY_SETUP.md` (this file)

### Modified:
- `src/lib/types.ts` - Added MediaFile interface
- `src/components/admin/AdminProductForm.tsx` - Integrated FileUploader
- `src/components/ProductImageGallery.tsx` - Added video support
- `src/app/admin/page.tsx` - Added media parsing
- `src/app/products/page.tsx` - Added media parsing
- `src/app/products/[id]/page.tsx` - Pass media to gallery
- `src/app/api/admin/products/route.ts` - Handle media in POST
- `src/app/api/admin/products/[id]/route.ts` - Handle media in PUT
- `next.config.js` - Added Cloudinary domain

## Troubleshooting

### Images Not Displaying
- Check Cloudinary credentials in `.env`
- Verify domain is added to `next.config.js`
- Restart dev server after config changes

### Upload Fails
- Check file size limits (5MB images, 50MB videos)
- Verify file format is supported
- Check browser console for errors
- Ensure admin authentication is working

### Videos Not Playing
- Ensure browser supports MP4 format
- Check video file is not corrupted
- Verify video was uploaded successfully to Cloudinary

### Database Errors
- Ensure migration was run successfully
- Check `media` column exists: `SELECT column_name FROM information_schema.columns WHERE table_name='products';`
- Verify JSONB format is valid

## Next Steps

1. **Run the database migration** (most important!)
2. Test adding a new product with images
3. Test adding a product with videos
4. Test editing existing products
5. Verify media displays correctly on product pages

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check server logs in terminal
3. Verify all environment variables are set
4. Ensure migration was run successfully
