import { NextResponse } from 'next/server';
import client from '../../../../lib/sanityClient';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Adjust size limit as needed
    },
  },
};

export async function POST(request) {
  try {
    const data = await request.json();
    const { imageUrl, fileData } = data;

    let imageAsset = null;

    if (imageUrl) {
      // Handle URL-based image upload
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');
        const buffer = await response.arrayBuffer();
        
        imageAsset = await client.assets.upload('image', Buffer.from(buffer), {
          filename: `product-image-${Date.now()}`,
          contentType: response.headers.get('content-type'),
        });
      } catch (error) {
        console.error('Error uploading image from URL:', error);
        throw error;
      }
    } else if (fileData) {
      // Handle direct file upload
      try {
        const buffer = Buffer.from(fileData.split(',')[1], 'base64');
        imageAsset = await client.assets.upload('image', buffer, {
          filename: `product-image-${Date.now()}`,
          contentType: 'image/jpeg', // Adjust based on file type
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }

    if (!imageAsset) {
      throw new Error('No image data provided');
    }

    return NextResponse.json({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image',
      details: error.message 
    }, { status: 500 });
  }
} 