import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Simulate fetching metadata for demonstration purposes
    // Replace with actual metadata-fetching logic or an external service call
    const metadata = {
      title: "Sample Title",
      description: "Sample description for the link",
      image: "https://via.placeholder.com/150"
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching URL preview:", error);
    return NextResponse.json({ error: "Error fetching URL preview" }, { status: 500 });
  }
}
