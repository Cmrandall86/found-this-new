import { NextResponse } from 'next/server';
import { fetchPreviewUrls } from '../../../utils/previewUtils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const previewData = await fetchPreviewUrls(url);
    
    return NextResponse.json(previewData, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      }
    });
  } catch (error) {
    console.error('Error in fetchPreview:', error);
    return NextResponse.json({
      title: 'Preview Unavailable',
      description: 'Unable to load preview data',
      images: []
    });
  }
}
