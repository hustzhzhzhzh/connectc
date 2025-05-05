Page({
  data: {
    newsUrl: ''
  },

  onLoad(options) {
    const decodedUrl = decodeURIComponent(options.url);
    this.setData({
      newsUrl: decodedUrl
    });
  }
  
});