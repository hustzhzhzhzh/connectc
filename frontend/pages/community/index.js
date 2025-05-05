Page({
  data: { title: '', content: '',
  postCategories: ['线下热门', '房源', '日用品', '出行', '超市', '更多'],
  categoryIndex: 0, },
    // 处理分类选择变化
  onCategoryChange(e) {
    const index = e.detail.value;
    this.setData({
      categoryIndex: index,
      title: this.data.postCategories[index] // 自动将选中的分类设为标题
    });
  },
  onContentInput(e) { this.setData({ content: e.detail.value }) },
  
  submit() {
    const app = getApp();
    const userId = app.globalData.userInfo.id; // 从全局存储获取
   
    if (!userId || !this.data.title || !this.data.content) {
      wx.showToast({ title: '请输入完整', icon: 'none' });
      return;
    }

    wx.request({
      url: 'http://localhost:3000/api/posts',
      method: 'POST',
      data: {
        userId: userId,  //从登录状态获取
        title: this.data.title,
        content: this.data.content
        
      },
      success: () => {
        wx.showToast({ 
          title: '发布成功', 
          success: () => {
            wx.switchTab({ url: '/pages/community/community' })
          }
        });
      }
    });
    
      
  }
});