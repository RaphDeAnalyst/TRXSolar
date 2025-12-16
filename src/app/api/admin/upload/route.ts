import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/auth';
import cloudinary, { validateFile, FILE_VALIDATION } from '@/lib/cloudinary';

// Maximum duration for video uploads (increased for reliability)
export const maxDuration = 120; // 120 seconds

export async function POST(request: NextRequest) {
  console.log('📤 [Upload] POST request received');
  console.log('📤 [Upload] Timestamp:', new Date().toISOString());

  // Check authentication
  if (!checkAdminAuth(request)) {
    console.error('📤 [Upload] Authentication failed');
    return unauthorizedResponse();
  }

  console.log('📤 [Upload] Authentication successful');

  try {
    // Check Cloudinary configuration
    console.log('📤 [Upload] Cloudinary config check:');
    console.log('  - Cloud name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'MISSING');
    console.log('  - API key:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING');
    console.log('  - API secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING');

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is incomplete. Please check environment variables.');
    }

    console.log('📤 [Upload] Starting file upload process...');

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    console.log('📤 [Upload] Received files:', files.length);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    // Validate file count
    if (files.length > FILE_VALIDATION.maxFiles) {
      return NextResponse.json(
        { success: false, error: `Maximum ${FILE_VALIDATION.maxFiles} files allowed` },
        { status: 400 }
      );
    }

    // Validate each file
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          { success: false, error: validation.error },
          { status: 400 }
        );
      }
    }

    // Upload files to Cloudinary
    const uploadPromises = files.map(async (file, index) => {
      console.log(`📤 [Upload] Processing file ${index + 1}:`, {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const isVideo = file.type.startsWith('video/');

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'vcsolar/products',
            resource_type: isVideo ? 'video' : 'image',
            // Removed transformations - will be done at URL-time via transformCloudinaryUrl()
            // This makes uploads faster and more flexible
          },
          (error, result) => {
            if (error) {
              console.error(`📤 [Upload] Error uploading file ${index + 1}:`, error);
              reject(error);
            } else {
              console.log(`📤 [Upload] ✅ File ${index + 1} uploaded successfully:`, result!.secure_url);
              resolve({
                url: result!.secure_url,
                type: isVideo ? 'video' : 'image',
                public_id: result!.public_id,
                thumbnail_url: isVideo ? result!.eager?.[0]?.secure_url : result!.secure_url,
                order: index,
                width: result!.width,
                height: result!.height,
                format: result!.format,
              });
            }
          }
        );

        uploadStream.end(buffer);
      });
    });

    console.log('📤 [Upload] Starting parallel upload to Cloudinary...');
    const uploadedFiles = await Promise.all(uploadPromises);
    console.log(`📤 [Upload] ✅ All ${uploadedFiles.length} files uploaded successfully`);

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('[Upload] Error details:', error);
    console.error('[Upload] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove files from Cloudinary
export async function DELETE(request: NextRequest) {
  if (!checkAdminAuth(request)) {
    return unauthorizedResponse();
  }

  try {
    const { public_id, resource_type } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { success: false, error: 'public_id required' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || 'image',
    });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
