export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    // ... other fields
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    // ... other fields
  ],
} 