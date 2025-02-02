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
      validation: Rule => Rule.required()
    },
    { 
      name: "price", 
      title: "Price", 
      type: "number",
      validation: Rule => Rule.required().min(0).precision(2)
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
      validation: Rule => Rule.unique()
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'productURL'
    },
    prepare(selection) {
      const {title, subtitle} = selection;
      return {
        title: title || 'Untitled',
        subtitle: subtitle?.slice(0, 50) + (subtitle?.length > 50 ? '...' : '') || 'No description'
      };
    }
  },
  orderings: [
    {
      title: 'Created At, New',
      name: 'createdAtDesc',
      by: [
        {field: 'createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Price, Low to High',
      name: 'priceAsc',
      by: [
        {field: 'price', direction: 'asc'}
      ]
    }
  ]
}; 