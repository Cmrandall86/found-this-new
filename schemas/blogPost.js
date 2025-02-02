export default {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    { 
      name: "title", 
      title: "Title", 
      type: "string",
      validation: Rule => Rule.required().min(2).max(100)
    },
    { 
      name: "description", 
      title: "Description", 
      type: "text",
      validation: Rule => Rule.max(500)
    },
    { 
      name: "productURL", 
      title: "Product URL", 
      type: "url",
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      })
    },
    { 
      name: "price", 
      title: "Price", 
      type: "number",
      validation: Rule => Rule.required().min(0).precision(2)
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
      validation: Rule => Rule.required()
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      options: {
        readOnly: true,
      },
      validation: Rule => Rule.required()
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ 
        type: "string",
        validation: Rule => Rule.min(2).max(30)
      }],
      validation: Rule => Rule.unique(),
      description: "Add tags to help categorize your product",
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'price',
      media: 'mainImage'
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle ? `$${subtitle}` : 'No price set',
        media: media
      }
    }
  }
} 