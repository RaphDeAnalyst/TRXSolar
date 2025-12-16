/**
 * Client-side Cloudinary utilities
 * These functions work in the browser and don't require the Cloudinary SDK
 */

// Cloudinary URL transformation options
export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: 'limit' | 'fill' | 'fit' | 'scale';
  gravity?: 'auto' | 'center' | 'face';
  fetchFormat?: 'auto';
}

/**
 * Transform Cloudinary URL with optimization parameters
 * This adds URL-time transformations for better performance
 *
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 * @returns Optimized Cloudinary URL
 */
export function transformCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  // Check if it's a Cloudinary URL
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  // Default options for optimal performance
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    gravity,
    fetchFormat = 'auto'
  } = options;

  // Build transformation string
  const transformations: string[] = [];

  // Add fetch format (f_auto) - automatically serves WEBP/AVIF
  if (fetchFormat === 'auto') {
    transformations.push('f_auto');
  } else if (format && format !== 'auto') {
    transformations.push(`f_${format}`);
  }

  // Add quality (q_auto) - automatically optimizes quality
  if (quality === 'auto') {
    transformations.push('q_auto');
  } else if (typeof quality === 'number') {
    transformations.push(`q_${quality}`);
  }

  // Add width
  if (width) {
    transformations.push(`w_${width}`);
  }

  // Add height
  if (height) {
    transformations.push(`h_${height}`);
  }

  // Add crop mode
  if (crop) {
    transformations.push(`c_${crop}`);
  }

  // Add gravity (for smart cropping)
  if (gravity) {
    transformations.push(`g_${gravity}`);
  }

  // If no transformations, return original URL
  if (transformations.length === 0) {
    return url;
  }

  // Insert transformations into URL
  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/...
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) {
    return url;
  }

  const transformString = transformations.join(',');
  const optimizedUrl = url.slice(0, uploadIndex + 8) + transformString + '/' + url.slice(uploadIndex + 8);

  return optimizedUrl;
}

/**
 * Generate responsive image srcset for Cloudinary URLs
 * Creates multiple sizes for responsive images
 *
 * @param url - Original Cloudinary URL
 * @param widths - Array of widths to generate (default: [400, 800, 1200, 1600])
 * @returns srcset string for img/Image tag
 */
export function generateCloudinarySrcSet(
  url: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  if (!url || !url.includes('res.cloudinary.com')) {
    return '';
  }

  const srcsetParts = widths.map(width => {
    const transformedUrl = transformCloudinaryUrl(url, {
      width,
      quality: 'auto',
      format: 'auto',
      crop: 'limit'
    });
    return `${transformedUrl} ${width}w`;
  });

  return srcsetParts.join(', ');
}
