module.exports = {
  onPreBuild: async ({ utils }) => {
    await utils.cache.clear('images');
    console.log('Cleared image cache');
  },
}; 