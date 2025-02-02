export default {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { 
      name: "title", 
      title: "Title", 
      type: "string",
      validation: Rule => Rule.required()
    },
    { 
      name: "description", 
      title: "Description", 
      type: "text" 
    },
    { 
      name: "productURL", 
      title: "Product URL", 
      type: "url" 
    },
    { 
      name: "price", 
      title: "Price", 
      type: "number",
      validation: Rule => Rule.min(0)
    },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: {
        hotspot: true
      }
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      options: {
        readOnly: true,
      },
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      options: {
        readOnly: true,
      },
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Add tags to help categorize your product",
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage'
    }
  }
} 