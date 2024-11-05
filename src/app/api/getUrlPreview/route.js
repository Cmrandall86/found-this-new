import { getLinkPreview } from 'link-preview-js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const previewData = await getLinkPreview(url);
    return NextResponse.json(previewData);
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    return NextResponse.json({ error: 'Error fetching URL preview' }, { status: 500 });
  }
}
