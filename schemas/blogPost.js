export default {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "description", title: "Description", type: "text" },
    { name: "productURL", title: "Product URL", type: "url" },
    { name: "price", title: "Price", type: "number" },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true, // Enables UI for selecting focal point
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        }
      ]
    },
    {
      name: "imageMetadata",
      title: "Image Metadata",
      type: "object",
      fields: [
        {
          name: "source",
          title: "Source",
          type: "string"
        },
        {
          name: "uploadedAt",
          title: "Uploaded At",
          type: "datetime"
        }
      ]
    },
    // ... other existing fields
  ]
} 