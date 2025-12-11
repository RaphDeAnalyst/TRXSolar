import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Cloudinary configured:', {
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? '***configured***' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'MISSING',
  });
}

export default cloudinary;

// File validation constants
export const FILE_VALIDATION = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxVideoSize: 50 * 1024 * 1024, // 50MB
  maxFiles: 10,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
};

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const isImage = FILE_VALIDATION.allowedImageTypes.includes(file.type);
  const isVideo = FILE_VALIDATION.allowedVideoTypes.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: 'Invalid file type. Only images (JPG, PNG, WEBP) and videos (MP4, MOV) are allowed.'
    };
  }

  const maxSize = isImage ? FILE_VALIDATION.maxImageSize : FILE_VALIDATION.maxVideoSize;
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB for ${isImage ? 'images' : 'videos'}.`
    };
  }

  return { valid: true };
};
