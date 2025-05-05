// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    // 导航状态
    tabs: ['线下热门','房源','日用品','出行','超市','更多'],
    activeTab: 0,
    posts: [],
    filteredPosts: [], // 筛选后的帖子
    filterCategory: '' // 当前筛选的分类
  },
// 导航切换
switchTab(e) {
  const index = e.currentTarget.dataset.index;
  this.setData({ 
    activeTab: index,
    filterCategory: this.data.tabs[index] // 设置当前筛选分类
  });
  this.applyFilter();
},
// 应用筛选
applyFilter() {
  const { posts, filterCategory } = this.data;
  
  if (!filterCategory) {
    // 如果没有筛选条件，显示所有帖子
    this.setData({ filteredPosts: posts });
  } else {
    // 根据筛选条件过滤帖子
    const filtered = posts.filter(post => {
      // 假设帖子标题包含筛选关键词
      return post.title.includes(filterCategory);
    });
    this.setData({ filteredPosts: filtered });
  }
},
formatRelativeTime(created_at) {
  const now = new Date();
  const postDate = new Date(created_at);
  let diffMs = now - postDate;

  // 处理未来时间（显示为倒计时）
  if (diffMs < 0) {
    diffMs = Math.abs(diffMs);
    return `发布后${this.formatCountdown(diffMs)}`;
  }

  const units = [
    { unit: '月', ms: 30 * 24 * 60 * 60 * 1000 },
    { unit: '周', ms: 7 * 24 * 60 * 60 * 1000 },
    { unit: '天', ms: 24 * 60 * 60 * 1000 },
    { unit: '小时', ms: 60 * 60 * 1000 },
    { unit: '分钟', ms: 60 * 1000 },
    { unit: '秒', ms: 1000 }
  ];

  for (let i = 0; i < units.length; i++) {
    const { unit, ms } = units[i];
    if (diffMs >= ms) {
      const val = Math.floor(diffMs / ms);
      return `${val}${unit}${val > 1 ? '前' : ''}`;
    }
  }
  return '刚刚';
},

formatCountdown(ms) {
  if (ms < 60 * 1000) {
    return `${Math.floor(ms / 1000)}秒`;
  } else if (ms < 60 * 60 * 1000) {
    return `${Math.floor(ms / 60000)}分钟`;
  } else {
    return `${Math.floor(ms / 3600000)}小时`;
  }
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
          const posts = res.data.map(post => ({
            ...post,
            formattedTime: this.formatRelativeTime(post.created_at)
          }));
        this.setData({
          posts,          // 使用格式化后的数据
          filteredPosts: posts // 保持过滤数据同步
        });
        if (this.data.filterCategory) {
          this.applyFilter();
        }

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
// 发布新帖子后刷新列表
onPostSuccess() {
  this.fetchPosts();
},
showError: function(message) {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
},

navigateToDetail: function(e) {
  const postId = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: `/pages/community/post`
  });
},

login() {
  
  
  wx.login({
    success: async (res) => {
      try {
        wx.request({
          url: 'http://localhost:3000/api/wechat-login',
          method: 'POST',
          data: { code: res.code },
          header: { 'Content-Type': 'application/json' },
          success: (res) => {
            console.log( res.data.userId); // 应为 { success: true, userId: 1 }
            if (res.data.userId) {
              const userId = res.data.userId;
              const app = getApp();
              app.globalData.userInfo = { id: userId };
              console.log('全局存储的用户ID:', app.globalData.userInfo.id);
              console.log( userId); // 应为 { success: true, userId: 1 }
              
              wx.redirectTo({ url: '/pages/community/index' });

          }
        }
          
        });

      } catch (err) {
        console.error('登录异常:', err);
      }
    }
  });
}

})