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
      type: "url",
      validation: Rule => Rule.required()
    },
    { 
      name: "price", 
      title: "Price", 
      type: "number",
      validation: Rule => Rule.required()
    },
    {
      name: "previewImage",
      title: "Preview Image",
      type: "string"
    },
    {
      name: "previewTitle",
      title: "Preview Title",
      type: "string"
    },
    {
      name: "previewDescription",
      title: "Preview Description",
      type: "text"
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: Rule => Rule.required()
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime"
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Add tags to help categorize your product",
      validation: Rule => Rule.unique()
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description'
    },
    prepare(selection) {
      const {title, subtitle} = selection;
      return {
        title: title || 'Untitled',
        subtitle: subtitle?.slice(0, 50) + (subtitle?.length > 50 ? '...' : '') || 'No description'
      };
    }
  }
} 