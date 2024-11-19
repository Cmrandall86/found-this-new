export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    console.warn("API called without a URL");
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const previewData = await getLinkPreview(url);

    const productImages = previewData.images
      .filter((img) => img.includes("_AC_") || img.includes("_SX"))
      .map((img) =>
        img.replace(/(_AC_.*?_)/, "_AC_SL500_").replace(/(_SX\d+_)/, "_SL500_")
      )
      .slice(0, 4);

    return NextResponse.json({
      title: previewData.title || "No title available",
      description: previewData.description || "No description available",
      images: productImages.length > 0 ? productImages : ["https://via.placeholder.com/300x200?text=No+Image"],
    });
  } catch (error) {
    console.error("Error fetching preview data:", error.message);
    return NextResponse.json({
      error: "Failed to fetch preview",
      title: "No Preview Available",
      description: "No description available",
      images: ["https://via.placeholder.com/300x200?text=No+Image"], // Use placeholder image
    }, { status: 500 });
  }
}
