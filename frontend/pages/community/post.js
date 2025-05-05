Page({
  data: {
    posts: []
  },
  
  onLoad: function() {
    this.fetchPosts();
  },
  
  fetchPosts: function() {
    wx.showLoading({
      title: '加载中...',
    });
    
    // 调用后端API获取帖子列表
    wx.request({
      url: 'http://localhost:3000/api/getposts',
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            posts: res.data
          });
        } else {
          this.showError('获取帖子失败，请重试');
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
        this.showError('网络错误，请检查网络连接');
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  
  showError: function(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }

});